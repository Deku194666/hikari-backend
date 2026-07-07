import express from "express";
import { authRequired, vetRequired } from "../middleware/authMiddleware.js";
import { getMyOrders, getAllOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/mine", authRequired, getMyOrders);
router.get("/", vetRequired, getAllOrders);

export default router;