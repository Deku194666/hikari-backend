import User from "../models/User.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ningún archivo" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // borra la foto anterior si existía
    if (user.photo) {
      const oldPath = path.join("uploads/profiles", path.basename(user.photo));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.photo = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Completa ambos campos" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};