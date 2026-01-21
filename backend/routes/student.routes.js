import express from "express";
import { auth, role } from "../middlewares/auth.middleware.js";
import {
  getClasses,
  enrollClass,
  getMyEnrollments,
  checkPaymentStatus,
  saveSelectedSlot,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/classes", auth, role("STUDENT"), getClasses);
router.get("/my-classes", auth, role("STUDENT"), getMyEnrollments);
router.get("/checkPaymentStatus/:tutorId", auth, role("STUDENT"), checkPaymentStatus);
router.post("/saveSelectedSlot", auth, role("STUDENT"), saveSelectedSlot);
router.post("/enroll", auth, role("STUDENT"), enrollClass);

export default router;
