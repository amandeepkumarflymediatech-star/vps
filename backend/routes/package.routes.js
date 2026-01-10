import express from "express";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";

import { auth, role } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: list & detail for students (no auth required)
router.get("/", getPackages);
router.get("/:id", getPackageById);

// Admin-only: manage packages
router.post("/", auth, role("ADMIN"), createPackage);
router.put("/:id", auth, role("ADMIN"), updatePackage);
router.delete("/:id", auth, role("ADMIN"), deletePackage);

export default router;
