import mongoose from "mongoose";

const clinicalRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },

    // --- Anamnesis ---
    anamnesis: { type: String },

    // --- Examen físico / signos vitales ---
    weight: { type: Number },
    temperature: { type: String },
    heartRate: { type: String },
    respiratoryRate: { type: String },
    mucousMembranes: { type: String },
    capillaryRefillTime: { type: String },
    bodyCondition: { type: String },
    auscultation: { type: String },
    physicalExam: { type: String },

    // --- Síntomas ---
    symptoms: { type: String },

    // --- Diagnóstico ---
    presumptiveDiagnosis: { type: String },
    examResults: { type: String },
    diagnosis: { type: String },

    // --- Tratamiento ---
    treatment: { type: String },
    medications: { type: String },
    surgery: { type: String },
    rehabilitation: { type: String },

    // --- Notas ---
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("ClinicalRecord", clinicalRecordSchema);