import TutorAvailability from "../models/TutorAvailability.js";
import Enrollment from "../models/enrollment.js";
// utils/date.js

export const normalizeDateUTC = (dateString) => {
  if (!dateString) return new Date();
  if (typeof dateString === "string" && dateString.includes("-")) {
    const cleanStr = dateString.split("T")[0];
    const [year, month, day] = cleanStr.split("-").map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(Date.UTC(year, month - 1, day));
    }
  }
  const d = new Date(dateString);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

// Get tutor's availability for a specific week
export const getAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { date } = req.query;

    // 1️⃣ Calculate week start (Monday) if not provided
    let startDate;

    if (date) {
      startDate = normalizeDateUTC(date);
    } else {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sunday
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setUTCHours(0, 0, 0, 0);
      startDate = monday;
    }

    // 2️⃣ Calculate week end (Sunday / +7 days)
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 7);

    // 3️⃣ Fetch availability and active enrollments in parallel
    const [availability, activeEnrollments] = await Promise.all([
      TutorAvailability.find({
        tutorId,
        date: { $gte: startDate, $lt: endDate },
      })
        .sort({ date: 1 })
        .lean(),
      Enrollment.find({
        tutorId,
        status: { $ne: "CANCELLED" },
        "slot.date": { $gte: startDate, $lt: endDate },
      }).lean(),
    ]);

    // Build lookup for active booked slots by slotId and by (dateStr + startTime)
    const bookedSlotIds = new Set();
    const bookedDateTimes = new Set();

    activeEnrollments.forEach((e) => {
      if (e.slotId) bookedSlotIds.add(e.slotId.toString());
      if (e.slot?.date && e.slot?.startTime) {
        const dStr = new Date(e.slot.date).toISOString().split("T")[0];
        bookedDateTimes.add(`${dStr}_${e.slot.startTime}`);
      }
    });

    // 4️⃣ Format data for frontend, cross-checking with active enrollments
    const formatted = availability.map((day) => {
      const dayDateStr = new Date(day.date).toISOString().split("T")[0];
      return {
        _id: day._id,
        date: day.date,
        availability: day.availability.map((slot) => {
          const isSlotBooked =
            slot.isBooked === true ||
            bookedSlotIds.has(slot._id?.toString()) ||
            bookedDateTimes.has(`${dayDateStr}_${slot.startTime}`);

          return {
            ...slot,
            slotId: slot._id,
            isBooked: Boolean(isSlotBooked),
          };
        }),
      };
    });

    res.status(200).json({
      success: true,
      data: formatted.length ? formatted : [],
      message: formatted.length
        ? "Availability fetched"
        : "No availability set for this week",
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
};

export const saveAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { date, availability } = req.body;

    if (!date || !availability) {
      return res.status(400).json({
        success: false,
        message: "date and availability are required",
      });
    }

    const normalizedDate = normalizeDateUTC(date);

    // Fetch active enrollments for this day to protect booked slots from being overwritten
    const dayStart = new Date(normalizedDate);
    const dayEnd = new Date(normalizedDate);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const activeEnrollments = await Enrollment.find({
      tutorId,
      status: { $ne: "CANCELLED" },
      "slot.date": { $gte: dayStart, $lt: dayEnd },
    }).lean();

    const bookedSlotIds = new Set(
      activeEnrollments.map((e) => e.slotId?.toString()).filter(Boolean)
    );
    const bookedStartTimes = new Set(
      activeEnrollments.map((e) => e.slot?.startTime).filter(Boolean)
    );

    const existing = await TutorAvailability.findOne({
      tutorId,
      date: normalizedDate,
    });

    if (existing) {
      // Merge incoming availability with existing slots while preserving booked status & slot IDs
      const mergedAvailability = [...existing.availability];

      availability.forEach((newSlot) => {
        const index = mergedAvailability.findIndex(
          (slot) =>
            slot.startTime === newSlot.startTime &&
            slot.endTime === newSlot.endTime,
        );

        if (index !== -1) {
          const currentSlot = mergedAvailability[index];
          const isSlotBooked =
            Boolean(currentSlot.isBooked) ||
            Boolean(newSlot.isBooked) ||
            bookedSlotIds.has(currentSlot._id?.toString()) ||
            bookedStartTimes.has(newSlot.startTime);

          mergedAvailability[index].isAvailable = isSlotBooked ? true : Boolean(newSlot.isAvailable);
          mergedAvailability[index].isBooked = isSlotBooked;
        } else {
          // Add new slot
          const isSlotBooked =
            Boolean(newSlot.isBooked) || bookedStartTimes.has(newSlot.startTime);
          mergedAvailability.push({
            ...newSlot,
            isBooked: isSlotBooked,
          });
        }
      });

      existing.availability = mergedAvailability;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Availability updated",
        data: existing,
      });
    }

    const newSlots = availability.map((s) => ({
      ...s,
      isBooked: Boolean(s.isBooked || bookedStartTimes.has(s.startTime)),
    }));

    const newAvailability = new TutorAvailability({
      tutorId,
      date: normalizedDate,
      availability: newSlots,
    });

    await newAvailability.save();

    return res.status(201).json({
      success: true,
      message: "Availability saved",
      data: newAvailability,
    });
  } catch (error) {
    console.error("Save availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete tutor's availability for a specific week
export const deleteAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { id } = req.params;

    const availability = await TutorAvailability.findOne({
      _id: id,
      tutorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    await TutorAvailability.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability",
      error: error.message,
    });
  }
};

// Get availability by tutor ID (for students to view)
export const getAvailabilityByTutorId = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { weekStartDate } = req.query;

    let startDate;
    if (weekStartDate) {
      startDate = normalizeDateUTC(weekStartDate);
    } else {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setUTCHours(0, 0, 0, 0);
      startDate = monday;
    }

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 7);

    const [availability, activeEnrollments] = await Promise.all([
      TutorAvailability.find({
        tutorId,
        date: { $gte: startDate, $lt: endDate },
      }).sort({ date: 1 }).lean(),
      Enrollment.find({
        tutorId,
        status: { $ne: "CANCELLED" },
        "slot.date": { $gte: startDate, $lt: endDate },
      }).lean(),
    ]);

    const bookedSlotIds = new Set();
    const bookedDateTimes = new Set();
    activeEnrollments.forEach((e) => {
      if (e.slotId) bookedSlotIds.add(e.slotId.toString());
      if (e.slot?.date && e.slot?.startTime) {
        const dStr = new Date(e.slot.date).toISOString().split("T")[0];
        bookedDateTimes.add(`${dStr}_${e.slot.startTime}`);
      }
    });

    const formatted = availability.map((day) => {
      const dayDateStr = new Date(day.date).toISOString().split("T")[0];
      return {
        ...day,
        availability: day.availability.map((slot) => {
          const isSlotBooked =
            slot.isBooked === true ||
            bookedSlotIds.has(slot._id?.toString()) ||
            bookedDateTimes.has(`${dayDateStr}_${slot.startTime}`);
          return {
            ...slot,
            slotId: slot._id,
            isBooked: Boolean(isSlotBooked),
          };
        }),
      };
    });

    res.status(200).json({
      success: true,
      data: formatted.length > 0 ? formatted : null,
      message: formatted.length > 0 ? "Availability found" : "No availability set for this week",
    });
  } catch (error) {
    console.error("Error fetching tutor availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor availability",
      error: error.message,
    });
  }
};
