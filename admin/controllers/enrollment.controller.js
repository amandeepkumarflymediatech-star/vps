const Enrollment = require("../models/enrollment");
const User = require("../models/userModel");

/**
 * LIST ENROLLMENTS
 */
exports.renderEnrollments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const totalEnrollments = await Enrollment.countDocuments(filter);
    const enrollments = await Enrollment.find(filter)
      .populate("userId", "name email role")
      .populate("tutorId", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.render("enrollments/list", {
      enrollments,
      currentPage: page,
      totalPages: Math.ceil(totalEnrollments / limit),
      totalEnrollments,
      limit,
      currentStatus: status || "",
    });
  } catch (error) {
    console.error("Admin enrollments list error:", error);
    res.status(500).render("layouts/error", {
      message: "Failed to load enrollments",
      path: req.originalUrl,
    });
  }
};

/**
 * VIEW SINGLE ENROLLMENT
 */
exports.renderEnrollmentDetails = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("userId", "name email role phone")
      .populate("tutorId", "name email role phone")
      .lean();

    if (!enrollment) {
      return res.status(404).render("layouts/error", {
        message: "Enrollment not found",
        path: req.originalUrl,
      });
    }

    res.render("enrollments/view", { enrollment });
  } catch (error) {
    console.error("Admin enrollment view error:", error);
    res.status(500).render("layouts/error", {
      message: "Failed to load enrollment",
      path: req.originalUrl,
    });
  }
};

/**
 * UPDATE ENROLLMENT STATUS
 */
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status, meetingLink, notes } = req.body;
    
    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status, meetingLink, notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.json({ success: true, message: "Enrollment updated successfully" });
  } catch (error) {
    console.error("Admin enrollment update error:", error);
    res.status(500).json({ success: false, message: "Failed to update enrollment" });
  }
};
