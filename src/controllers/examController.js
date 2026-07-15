import ExamRequest from "../models/ExamRequest.js";

export const createExamRequest = async (req, res) => {
  try {
    const {
      pet,
      examTypes,
      otherDescription,
      paymentMethod,
      address,
      notes
    } = req.body;

    const newRequest = new ExamRequest({
      pet,
      owner: req.user.id,
      examTypes,
      otherDescription,
      paymentMethod,
      address,
      notes
    });

    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la solicitud de examen", error: error.message });
  }
};

export const getMyExamRequests = async (req, res) => {
  try {
    const requests = await ExamRequest.find({ owner: req.user.id })
      .populate("pet", "name type breed")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tus solicitudes", error: error.message });
  }
};

export const getAllExamRequests = async (req, res) => {
  try {
    const requests = await ExamRequest.find()
      .populate("pet", "name type breed")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las solicitudes", error: error.message });
  }
};

export const updateExamRequest = async (req, res) => {
  try {
    const updated = await ExamRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la solicitud", error: error.message });
  }
};