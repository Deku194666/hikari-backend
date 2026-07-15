import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getProfile, updateProfile, uploadProfilePhoto, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authRequired, getProfile);
router.put("/profile", authRequired, updateProfile);
router.post("/profile/photo", authRequired, upload.single("photo"), uploadProfilePhoto);
router.put("/change-password", authRequired, changePassword);

export default router;