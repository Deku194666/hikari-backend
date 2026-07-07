import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "Usuario no existe" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token invalido" });
  }
};

export const vetRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "vet") return res.status(403).json({ msg: "Acceso denegado" });
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "Usuario no existe" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token invalido" });
  }
};
