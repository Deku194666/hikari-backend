



import mongoose from "mongoose";

const examRequestSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    examTypes: {
      type: [String],
      required: true
    },
    otherDescription: {
      type: String
    },
    paymentMethod: {
      type: String,
      enum: ["Transferencia", "Efectivo", "Tarjeta"],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ["pendiente", "agendado", "realizado", "resultados_listos"],
      default: "pendiente"
    },
    scheduledDate: {
      type: Date
    },
    resultsNotes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("ExamRequest", examRequestSchema);