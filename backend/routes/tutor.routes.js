import express from "express";
import { applyTutor, listTutors, getTutorById, createClass, createBatch } from "../controllers/tutor.controller.js";
import {
  getAvailability,
  saveAvailability,
  deleteAvailability,
  getAvailabilityByTutorId
} from "../controllers/tutorAvailability.controller.js";
import { auth, role } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Tutor routes
 */

router.post("/", (req, res) => {
  res.json({ success: true, message: "Tutor base route working" });
});

// Public: list tutors for students/landing page
router.get("/list", listTutors);

// Tutor availability management (protected routes) - MUST come before /:id route
router.get("/availability/my", auth, role("TUTOR"), getAvailability);
router.post("/availability", auth, role("TUTOR"), saveAvailability);
router.delete("/availability/:id", auth, role("TUTOR"), deleteAvailability);

router.post("/apply", applyTutor);
router.post("/class", auth, role("TUTOR"), createClass);
router.post("/batch", auth, role("TUTOR"), createBatch);

// Public: single tutor detail - MUST come after specific routes
router.get("/:id", getTutorById);

// Public: get tutor availability by tutor ID (for students)
router.get("/:tutorId/availability", getAvailabilityByTutorId);

export default router;


