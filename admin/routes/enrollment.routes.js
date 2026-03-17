const express = require("express");
const router = express.Router();
const { auth, role } = require("../middlewares/auth.middleware");
const {
  renderEnrollments,
  renderEnrollmentDetails,
  updateEnrollmentStatus,
} = require("../controllers/enrollment.controller");

// LIST ENROLLMENTS
router.get("/", auth, role("ADMIN"), renderEnrollments);

// VIEW ENROLLMENT DETAILS
router.get("/:id", auth, role("ADMIN"), renderEnrollmentDetails);

// UPDATE ENROLLMENT STATUS
router.post("/:id/update", auth, role("ADMIN"), updateEnrollmentStatus);

module.exports = router;
