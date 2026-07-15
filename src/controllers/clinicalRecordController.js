import ClinicalRecord from "../models/ClinicalRecord.js";
import Pet from "../models/Pet.js";

export const createClinicalRecord = async (req, res) => {
  try {
    const {
      pet,
      date,
      anamnesis,
      weight,
      temperature,
      heartRate,
      respiratoryRate,
      mucousMembranes,
      capillaryRefillTime,
      bodyCondition,
      auscultation,
      physicalExam,
      symptoms,
      presumptiveDiagnosis,
      examResults,
      diagnosis,
      treatment,
      medications,
      surgery,
      rehabilitation,
      notes
    } = req.body;

    const petExists = await Pet.findById(pet);
    if (!petExists) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    const newRecord = new ClinicalRecord({
      pet,
      vet: req.user.id,
      date: date || Date.now(),
      anamnesis,
      weight,
      temperature,
      heartRate,
      respiratoryRate,
      mucousMembranes,
      capillaryRefillTime,
      bodyCondition,
      auscultation,
      physicalExam,
      symptoms,
      presumptiveDiagnosis,
      examResults,
      diagnosis,
      treatment,
      medications,
      surgery,
      rehabilitation,
      notes
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la ficha clínica", error: error.message });
  }
};

export const getRecordsByPet = async (req, res) => {
  try {
    const records = await ClinicalRecord.find({ pet: req.params.petId })
      .populate("vet", "name")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la ficha clínica", error: error.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await ClinicalRecord.findById(req.params.id).populate("vet", "name");
    if (!record) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el registro", error: error.message });
  }
};

export const updateClinicalRecord = async (req, res) => {
  try {
    const updatedRecord = await ClinicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el registro", error: error.message });
  }
};