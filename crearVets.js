import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Conectado a MongoDB");

  const vets = [
    { name: "Sofia Pirul Hernandez", email: "vet.sofip@gmail.com", password: "SofiaVet#2024" },
  ];

  for (const vet of vets) {
    const exists = await User.findOne({ email: vet.email });
    if (exists) {
      console.log(`Ya existe: ${vet.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(vet.password, 10);
    await User.create({ name: vet.name, email: vet.email, password: hashed, role: "vet" });
    console.log(`Creado exitosamente: ${vet.email}`);
  }

  mongoose.disconnect();
  console.log("Listo.");
}).catch(err => console.log("Error:", err));
