import express from "express";
import { vetRequired } from "../middleware/authMiddleware.js";
import {
  createClinicalRecord,
  getRecordsByPet,
  getRecordById,
  updateClinicalRecord
} from "../controllers/clinicalRecordController.js";

const router = express.Router();

router.post("/", vetRequired, createClinicalRecord);
router.get("/pet/:petId", vetRequired, getRecordsByPet);
router.get("/:id", vetRequired, getRecordById);
router.put("/:id", vetRequired, updateClinicalRecord);

export default router;