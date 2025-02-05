import express from "express";
import {
  getCategories,
  updateUserCategories,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCategories);
router.put("/user-preferences", protect, updateUserCategories);

export default router;
