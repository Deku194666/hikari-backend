import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pendiente", "atendida", "cancelada"],
      default: "pendiente"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);