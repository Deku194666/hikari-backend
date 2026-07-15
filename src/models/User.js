import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: ""
    },
    photo: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "cliente"
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);