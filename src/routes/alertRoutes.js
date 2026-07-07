import { Router } from "express";
import { getAlerts } from "../controllers/alertController.js";
import { vetRequired } from "../middleware/authMiddleware.js"; 

const router = Router();

router.get("/alerts", vetRequired, getAlerts);

export default router;