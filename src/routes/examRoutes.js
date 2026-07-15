



import express from "express";
import { authRequired, vetRequired } from "../middleware/authMiddleware.js";
import {
  createExamRequest,
  getMyExamRequests,
  getAllExamRequests,
  updateExamRequest
} from "../controllers/examController.js";

const router = express.Router();

router.post("/", authRequired, createExamRequest);
router.get("/mine", authRequired, getMyExamRequests);
router.get("/", vetRequired, getAllExamRequests);
router.put("/:id", vetRequired, updateExamRequest);

export default router;