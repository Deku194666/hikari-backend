import Appointment from "../models/Appointment.js";
import Pet from "../models/Pet.js";

// cliente o vet crea una cita para una mascota ya registrada
export const createAppointment = async (req, res) => {
  try {
    const { petId, date, time, reason, notes } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ msg: "Mascota no encontrada" });

    // evitar doble reserva del mismo horario
    const existing = await Appointment.findOne({
      date,
      time,
      status: { $ne: "cancelada" }
    });
    if (existing) {
      return res.status(400).json({ msg: "Ese horario ya fue reservado, elige otro" });
    }

    const appointment = await Appointment.create({
      pet: petId,
      owner: pet.owner,
      vet: req.user.role === "vet" ? req.user._id : undefined,
      date,
      time,
      reason,
      notes: notes || "",
      status: "pendiente"
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("pet")
      .populate("owner", "name email phone");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// cliente ve sus propias citas
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ owner: req.user._id })
      .populate("pet")
      .populate("vet", "name")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// vet ve todas las citas
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("pet")
      .populate("owner", "name email phone")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// vet cambia el estado (y opcionalmente agrega notas de atención)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!["pendiente", "atendida", "cancelada"].includes(status)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Cita no encontrada" });

    appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// vet reprograma (cambia fecha/hora/motivo)
export const updateAppointment = async (req, res) => {
  try {
    const { date, time, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Cita no encontrada" });

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// vet elimina una cita definitivamente
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Cita no encontrada" });

    await appointment.deleteOne();
    res.json({ msg: "Cita eliminada" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// cualquier usuario logueado ve qué horas están tomadas en una fecha (sin datos personales)
export const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: "Falta la fecha" });

    const appointments = await Appointment.find({
      date,
      status: { $ne: "cancelada" }
    }).select("time");

    const bookedTimes = appointments.map((a) => a.time);
    res.json({ date, bookedTimes });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// resumen del mes: cuántas citas hay por día (sin detalles), para pintar el calendario
export const getMonthSummary = async (req, res) => {
  try {
    const { year, month } = req.query; // month: 1-12
    if (!year || !month) return res.status(400).json({ msg: "Falta year o month" });

    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    const appointments = await Appointment.find({
      date: { $regex: `^${prefix}` },
      status: { $ne: "cancelada" }
    }).select("date");

    const summary = {};
    appointments.forEach((a) => {
      summary[a.date] = (summary[a.date] || 0) + 1;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};