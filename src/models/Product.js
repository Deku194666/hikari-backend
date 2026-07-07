import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    species: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    minStock: {
      type: Number,
      required: true,
      default: 5
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);