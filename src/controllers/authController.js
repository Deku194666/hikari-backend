import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "cliente"
    });

    res.json({ msg: "Cuenta creada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales incorrectas" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Credenciales incorrectas" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// paso 1: el usuario pide el link de recuperación
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // por seguridad, respondemos lo mismo exista o no el correo
    // (así nadie puede usar este endpoint para "adivinar" qué correos están registrados)
    if (!user) {
      return res.json({
        msg: "Si el correo existe, te enviamos un link para recuperar tu contraseña"
      });
    }

    // generamos un token aleatorio, guardamos su version encriptada en la BD,
    // y mandamos el token "en crudo" por correo (nunca guardamos el crudo en la BD)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Recupera tu contraseña - Hikari Vet",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1f4b43;">🐾 Hikari Vet</h2>
          <p>Hola ${user.name},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #ff6b4a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Restablecer contraseña
          </a>
          <p>Este link vence en 1 hora. Si tú no pediste este cambio, puedes ignorar este correo.</p>
        </div>
      `
    });

    res.json({
      msg: "Si el correo existe, te enviamos un link para recuperar tu contraseña"
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// paso 2: el usuario llega con el token del link y pone su nueva contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Faltan datos" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "El link es inválido o ya venció, solicita uno nuevo" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ msg: "Contraseña actualizada correctamente, ya puedes iniciar sesión" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};