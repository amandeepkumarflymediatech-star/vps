import TutorAvailability from "../models/TutorAvailability.js";
import Class from "../models/class.js";
import Batch from "../models/batch.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Enrollment from "../models/enrollment.js"
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const listTutors = async (req, res) => {
  try {
    const { organizationId, page = 1, limit = 10 } = req.query;
    const filter = { role: "TUTOR", isVerified: true, status: "ACTIVE" };

    if (organizationId) {
      filter.organizationId = organizationId;
    }

    // Pagination Logic
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 1️⃣ Fetch tutors
    const tutors = await User.find(filter)
      .select(
        "name email phone avatar description imageid organizationId createdAt expertise experience availability responseTime rating reviewsCount",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(); // <-- Use lean for easier merging

    // 2️⃣ Fetch availability for all tutors in one query
    const tutorIds = tutors.map((t) => t._id);
    const availabilities = await TutorAvailability.find({
      tutorId: { $in: tutorIds },
    })
      .sort({ date: 1 })
      .lean();

    // 3️⃣ Map availability by tutorId
    const availabilityMap = {};
    availabilities.forEach((a) => {
      if (!availabilityMap[a.tutorId]) availabilityMap[a.tutorId] = [];
      availabilityMap[a.tutorId].push({
        date: a.date,
        availability: a.availability.map((slot) => ({
          slotId: slot._id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
          isBooked: slot.isBooked,
        })),
      });
    });

    // 4️⃣ Merge availability into tutors
    const tutorsWithAvailability = tutors.map((tutor) => ({
      ...tutor,
      availability: availabilityMap[tutor._id] || [],
    }));

    // 5️⃣ Count total tutors
    const totalTutors = await User.countDocuments(filter);
    res.json({
      success: true,
      data: tutorsWithAvailability,
      pagination: {
        total: totalTutors,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalTutors / limitNum),
      },
    });
  } catch (error) {
    console.error("listTutors error", error);
    res.status(500).json({ message: error.message });
  }
};

// export const listTutors = async (req, res) => {
//   try {
//     const { organizationId, page = 1, limit = 10 } = req.query;
//     const filter = { role: "TUTOR", isVerified: true, status: "ACTIVE" };

//     if (organizationId) {
//       filter.organizationId = organizationId;
//     }

//     // Pagination Logic
//     const pageNum = parseInt(page, 10);
//     const limitNum = parseInt(limit, 10);
//     const skip = (pageNum - 1) * limitNum;

//     const tutors = await User.find(filter)
//       .select(
//         "name email phone avatar imageid organizationId createdAt expertise experience availability responseTime rating reviewsCount"
//       )
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limitNum);

//     const totalTutors = await User.countDocuments(filter);
// console.log(tutors)
//     res.json({
//       success: true,
//       data: tutors,
//       pagination: {
//         total: totalTutors,
//         page: pageNum,
//         limit: limitNum,
//         totalPages: Math.ceil(totalTutors / limitNum),
//       },
//     });
//   } catch (error) {
//     console.error("listTutors error", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid tutor id" });
    }

    const tutor = await User.findOne({
      _id: id,
      role: "TUTOR",
    }).select(
      "name email phone  description  organizationId avatar imageid status isVerified createdAt expertise experience bio education specialties availability responseTime rating reviewsCount",
    );
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    // ✅ Count enrollments for this tutor
    const enrollmentCount = await Enrollment.countDocuments({
      tutorId: id,
      // optional filters 👇
      // paymentStatus: "SUCCESS",
      // status: { $ne: "CANCELLED" },
    });

    res.json({
      success: true,
      data: {
        ...tutor.toObject(),
        enrollmentCount,
      },
    });
    // res.json({ success: true, data: tutor });
  } catch (error) {
    console.error("getTutorById error", error);
    res.status(500).json({ message: error.message });
  }
};

export const applyTutor = async (req, res) => {
  try {
    const { name, email, phone, expertise, experience } = req.body;
    console.log("Received tutor application data:", req.body);
    // 1️⃣ Validation
    if (!name || !email || !phone || !expertise || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Prevent duplicate applications

    // 2️⃣ Check email or phone already exists
    const existingTutor = await User.findOne({
      $or: [{ email: email }, { phone }],
    });

    if (existingTutor) {
      if (existingTutor.email === email) {
        return res
          .status(409)
          .json({ success: false, message: "Email already registered" });
      }

      if (existingTutor.phone === phone) {
        return res.status(409).json({
          success: false,
          message: "Try to use a different phone number",
        });
      }
    }

    // 3️⃣ Save application
    await User.create({
      name,
      email,
      phone,
      expertise,
      password: "",
      experience,
      role: "TUTOR",
      status: "INACTIVE",
    });

    // 4️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("❌ Tutor Apply Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createClass = async (req, res) => {
  const newClass = await Class.create({
    title: req.body.title,
    description: req.body.description,
    tutorId: req.user.id,
    organizationId: req.user.organizationId,
  });
  res.json(newClass);
};

export const createBatch = async (req, res) => {
  const batch = await Batch.create({
    ...req.body,
    tutorId: req.user.id,
    organizationId: req.user.organizationId,
  });
  res.json(batch);
};
