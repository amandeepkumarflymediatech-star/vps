import express from "express";
import { applyTutor, listTutors, getTutorById, createClass, createBatch } from "../controllers/tutor.controller.js";
import { auth ,role} from "../middlewares/auth.middleware.js"; 

const router = express.Router();

/**
 * Tutor routes
 */

router.post("/", (req, res) => {
  res.json({ success: true, message: "Tutor base route working" });
});

// Public: list tutors for students/landing page
router.get("/list", listTutors);

// Public: single tutor detail
router.get("/:id", getTutorById);

router.post("/apply", applyTutor);
router.post("/class", auth, role("TUTOR"), createClass);
router.post("/batch", auth, role("TUTOR"), createBatch);

export default router;
