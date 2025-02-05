import express from "express";
import {
  getCategories,
  updateUserCategories,
  getUserCategories,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCategories);
router.get("/user", protect, getUserCategories);
router.put("/user-preferences", protect, updateUserCategories);

export default router;
