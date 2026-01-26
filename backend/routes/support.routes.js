import express from "express";
import { submitSupportRequest, getAllSupportRequests, updateSupportStatus } from "../controllers/support.controller.js";
import { auth, role } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/submit", submitSupportRequest);

// Admin routes
router.get(
    "/all",
    auth,
    role("ADMIN"),
    getAllSupportRequests
);

router.put(
    "/:id/status",
    auth,
    role("ADMIN"),
    updateSupportStatus
);

export default router;
