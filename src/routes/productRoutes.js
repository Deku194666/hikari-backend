import express from "express";
import { authRequired, vetRequired } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  purchaseProducts
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", authRequired, getProducts);
router.post("/purchase", authRequired, purchaseProducts);
router.post("/", vetRequired, createProduct);
router.put("/:id", vetRequired, updateProduct);
router.delete("/:id", vetRequired, deleteProduct);

export default router;