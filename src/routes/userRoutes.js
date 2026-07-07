

import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// ruta protegida
router.get("/profile", authRequired, (req, res) => {
  res.json({
    msg: "Acceso permitido 🐾",
    user: req.user
  });
});

export default router;