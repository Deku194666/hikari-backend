import express from "express";
import { authRequired, vetRequired } from "../middleware/authMiddleware.js";
import { createPet, getPets, deletePet, updatePet, getAllPatients } from "../controllers/petController.js";

const router = express.Router();

router.post("/", authRequired, createPet);
router.get("/", authRequired, getPets);
router.get("/patients", vetRequired, getAllPatients);
router.delete("/:id", authRequired, deletePet);
router.put("/:id", authRequired, updatePet);

export default router;