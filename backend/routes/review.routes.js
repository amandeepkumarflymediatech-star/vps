import express from "express";
import { addReview, getLatestReviews, getTutorReviews } from "../controllers/review.controller.js";
import { auth, role } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: Get latest reviews for home page
router.get("/latest", getLatestReviews);

// Public: Get reviews for a specific tutor
router.get("/tutor/:tutorId", getTutorReviews);

// Protected: Only students can add reviews
router.post("/", auth, role("STUDENT"), addReview);

export default router;
