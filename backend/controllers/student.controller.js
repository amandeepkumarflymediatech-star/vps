import Class from "../models/class.js";
import Enrollment from "../models/enrollment.js";
import TutorAvailability from "../models/TutorAvailability.js";
import Payment from "../models/payment.js";
/**
 * STUDENT: LIST AVAILABLE CLASSES
 *
 * Returns only upcoming/ongoing classes, excluding past/completed ones,
 * enriched with tutor + course info so the frontend can render a rich card UI.
 *
 * Optional query params:
 *  - tutorId: filter by specific tutor
 */
export const getClasses = async (req, res) => {
  try {
    // const { tutorId } = req.query;

    const todayStary = new Date();
    todayStary.setHours(0, 0, 0, 0);

    // const filter = {
    //   status: { $in: ["UPCOMING", "ONGOING"] },
    //   endDate: { $gte: todayStary },
    // };

    // const classes = await Class.find(filter)
    //   .populate("tutorId")
    //   .populate("courseId", "title")
    //   .sort({ startDate: 1 })
    //   .lean();
    const tomorrow = new Date(todayStary);
    tomorrow.setDate(todayStary.getDate() + 1);

    const tutorSlotsToday = await TutorAvailability.find({
      date: { $gte: todayStary, $lt: tomorrow },
    })
      .populate("tutorId")
      .lean();

    return res.json({ success: true, data: tutorSlotsToday });
  } catch (error) {
    console.error("getClasses (student) error", error);
    return res.status(500).json({ message: error.message });
  }
};

// export const enrollClass = async (req, res) => {
//   try {
//     const { classId } = req.body;
//     const cls = await Class.findById(classId);

//     if (!cls) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Check if already enrolled
//     if (cls.enrolledStudents.includes(req.user.id)) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     if (cls.enrolledStudents.length >= cls.maxStudents) {
//       return res.status(400).json({ message: "Class full" });
//     }

//     // Atomic update
//     await Class.findByIdAndUpdate(classId, {
//       $addToSet: { enrolledStudents: req.user.id },
//     });

//     await Enrollment.create({
//       userId: req.user.id,
//       classId: cls._id,
//     });

//     res.json({ message: "Enrolled successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

/**
 * GET MY ENROLLMENTS
 * Fetch all classes the student is enrolled in via Batches.
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate({
        path: "slotId",
        populate: [
          { path: "userId" },
          { path: "tutorId", select: "name email image" },
        ],
      })
      .sort({ createdAt: -1 });

    const data = enrollments
      .filter((e) => e.slotId)
      .map((e) => {
        const cls = e.slotId;
        return {
          _id: cls._id, // Class ID
          enrollmentId: e._id,
          title: cls.title,
          description: cls.description,
          status: cls.status, // UPCOMING, ONGOING, COMPLETED
          startDate: cls.startDate,
          endDate: cls.endDate,
          schedule: cls.schedule, // [{day, startTime, endTime}]
          meetingLink: cls.meetingLink,
          tutorId: cls.tutorId, // {name, email}
          // {title}
          // batchId removed as we don't use it
        };
      });

    res.json({ success: true, data });
  } catch (error) {
    console.error("getMyEnrollments error", error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------- CHECK PAYMENT STATUS -----------------

export const checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const tutorId = req.params.tutorId;
    let status = "pending";
    const payment = await Payment.findOne({
      userId,
      tutorId,
    });
    if (payment && payment.status === "SUCCESS") {
      status = payment.status;
    }
    res.json({ paid: !!payment, status: status });
  } catch (err) {
    console.error("Check payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- SAVE SELECTED SLOT -----------------
export const saveSelectedSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.body)
    const { tutorId, slot, date } = req.body[0];
    const data = {
      tutorId: tutorId,
      slotId: slot._id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      date: date,
    };
    const { slotId, endTime, startTime } = data;
    // 1️⃣ Check payment
    const payment = await Payment.findOne({
      userId,
      tutorId,
      status: "SUCCESS",
    });

    if (!payment) {
      return res.status(403).json({ error: "Payment required" });
    }

    // 2️⃣ Check if slot already booked by this user
    const existingEnrollment = await Enrollment.findOne({
      userId,
      tutorId,
      slotId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "Slot already booked" });
    }
    // 3️⃣ Save enrollment
    const enrollment = await Enrollment.create({
      userId,
      tutorId,
      slotId,
      slot: {
        startTime,
        endTime,
        date,
      },
      status: "UPCOMING",
      paymentStatus: "SUCCESS",
    });

    //update tututor avaliballity isbooked true

    const updatedDoc = await TutorAvailability.updateOne(
      {
        tutorId: tutorId,
        date: date,
        "availability._id": slotId, // match the specific slot
       // optional: prevent double booking
      },
      {
        $set: {
          "availability.$.isBooked": true, // update the matched slot // optional: mark unavailable too
        },
      },
      { new: true }, // return the updated document
    );

   

    res.json({ message: "Slot booked successfully", data: enrollment });
  } catch (err) {
    console.error("Save slot error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- GET STUDENT ENROLLMENTS -----------------
export const enrollClass = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .populate("tutorId", "name avatar email")
      .lean();

    res.json({ data: enrollments });
  } catch (err) {
    console.error("Fetch enrollments error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
