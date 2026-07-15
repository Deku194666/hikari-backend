import express from "express";
import { authRequired, vetRequired } from "../middleware/authMiddleware.js";
import {
  createAppointment,
  getVets,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
  getAvailability,
  getMonthSummary
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", authRequired, createAppointment);
router.get("/vets", authRequired, getVets);
router.get("/mine", authRequired, getMyAppointments);
router.get("/availability", authRequired, getAvailability);
router.get("/summary", authRequired, getMonthSummary);
router.get("/", vetRequired, getAllAppointments);
router.put("/:id/status", vetRequired, updateAppointmentStatus);
router.put("/:id", vetRequired, updateAppointment);
router.delete("/:id", vetRequired, deleteAppointment);

export default router;