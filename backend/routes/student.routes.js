import express from "express";
import { auth, role } from "../middlewares/auth.middleware.js";
import {
  getClasses,
  enrollClass,
  cancelEnrollment,
  getMyEnrollments,
  updateMeetingLink,
  checkPaymentStatus, getAllEnrollmentStudents,
  saveSelectedSlot,
  getMyEnrollmentsStudent,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/classes", auth, role("STUDENT"), getClasses);
router.get("/my-classes", auth, role("TUTOR"), getMyEnrollments);
router.get("/student-classes", auth, role("STUDENT"), getMyEnrollmentsStudent);
router.get("/allenrollments", auth, role("STUDENT","TUTOR"), getAllEnrollmentStudents);
router.post(
  "/enrollments/:id/meeting-link",
  auth,
  role("TUTOR"),
  updateMeetingLink,
);
router.post("/enrollments/:id", auth, role("STUDENT"), cancelEnrollment);
router.get(
  "/checkPaymentStatus/:tutorId",
  auth,
  role("STUDENT"),
  checkPaymentStatus,
);
router.post("/saveSelectedSlot", auth, role("STUDENT"), saveSelectedSlot);

export default router;
