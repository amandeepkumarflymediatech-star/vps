import TutorAvailability from "../models/TutorAvailability.js";

// Get tutor's availability for a specific week
export const getAvailability = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const { weekStartDate } = req.query;

        // If no weekStartDate provided, calculate current week's Monday
        let startDate;
        if (weekStartDate) {
            startDate = new Date(weekStartDate);
        } else {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            startDate = monday;
        }

        const availability = await TutorAvailability.findOne({
            tutorId,
            weekStartDate: startDate,
        });

        if (!availability) {
            return res.status(200).json({
                success: true,
                message: "No availability set for this week",
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            data: availability,
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

// Save or update tutor's availability
export const saveAvailability = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const { weekStartDate, availability } = req.body;

        if (!weekStartDate || !availability) {
            return res.status(400).json({
                success: false,
                message: "weekStartDate and availability are required",
            });
        }

        // Check if availability already exists for this week
        const existingAvailability = await TutorAvailability.findOne({
            tutorId,
            weekStartDate: new Date(weekStartDate),
        });

        if (existingAvailability) {
            // Update existing availability
            existingAvailability.availability = availability;
            await existingAvailability.save();

            return res.status(200).json({
                success: true,
                message: "Availability updated successfully",
                data: existingAvailability,
            });
        } else {
            // Create new availability
            const newAvailability = new TutorAvailability({
                tutorId,
                weekStartDate: new Date(weekStartDate),
                availability,
            });

            await newAvailability.save();

            return res.status(201).json({
                success: true,
                message: "Availability created successfully",
                data: newAvailability,
            });
        }
    } catch (error) {
        console.error("Error saving availability:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save availability",
            error: error.message,
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
            startDate = new Date(weekStartDate);
        } else {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            startDate = monday;
        }

        const availability = await TutorAvailability.findOne({
            tutorId,
            weekStartDate: startDate,
        });

        if (!availability) {
            return res.status(200).json({
                success: true,
                message: "No availability set for this week",
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            data: availability,
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
