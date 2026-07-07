import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";





dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🟢"))
  .catch((err) => console.log("Error MongoDB 🔴", err));

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", alertRoutes);


app.get("/", (req, res) => {
  res.send("API Veterinaria funcionando 🐾");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});