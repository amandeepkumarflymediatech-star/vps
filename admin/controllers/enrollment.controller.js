const Enrollment = require("../models/enrollment");
const User = require("../models/userModel");

/**
 * LIST ENROLLMENTS
 */
exports.renderEnrollments = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const status = req.query.status ? req.query.status.trim() : "";
    const search = req.query.search ? req.query.search.trim() : "";
    const startDate = req.query.startDate ? req.query.startDate.trim() : "";
    const endDate = req.query.endDate ? req.query.endDate.trim() : "";

    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Filter by slot date range
    if (startDate || endDate) {
      filter["slot.date"] = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter["slot.date"].$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter["slot.date"].$lte = end;
        }
      }
      if (Object.keys(filter["slot.date"]).length === 0) {
        delete filter["slot.date"];
      }
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");

      // Match users (students or tutors) by name, email, or phone
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
        ],
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((u) => u._id);

      const orConditions = [
        { notes: { $regex: searchRegex } },
        { meetingLink: { $regex: searchRegex } },
        { "slot.startTime": { $regex: searchRegex } },
        { "slot.endTime": { $regex: searchRegex } },
      ];

      if (matchingUserIds.length > 0) {
        orConditions.push({ userId: { $in: matchingUserIds } });
        orConditions.push({ tutorId: { $in: matchingUserIds } });
      }

      // Check if search matches status names
      const validStatuses = ["UPCOMING", "COMPLETED", "CANCELLED", "MISSED", "PENDING"];
      if (validStatuses.some((s) => s.toLowerCase().includes(search.toLowerCase()))) {
        orConditions.push({ status: { $regex: searchRegex } });
      }

      filter.$or = orConditions;
    }

    const totalEnrollments = await Enrollment.countDocuments(filter);
    const enrollments = await Enrollment.find(filter)
      .populate("userId", "name email role phone")
      .populate("tutorId", "name email role phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.render("enrollments/list", {
      enrollments,
      currentPage: page,
      totalPages: Math.max(Math.ceil(totalEnrollments / limit) || 1, 1),
      totalEnrollments,
      limit,
      currentStatus: status || "",
      search,
      startDate,
      endDate,
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
