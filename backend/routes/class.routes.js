import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";

import { auth, role } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE
router.post("/", auth, role("ADMIN", "TUTOR"), createClass);

// READ
router.get("/", auth, role("ADMIN", "TUTOR"), getAllClasses);
router.get("/:id", auth, role("ADMIN", "TUTOR"), getClassById);

// UPDATE
router.put("/:id", auth, role("ADMIN", "TUTOR"), updateClass);

// DELETE
router.delete("/:id", auth, role("ADMIN", "TUTOR"), deleteClass);

export default router;
