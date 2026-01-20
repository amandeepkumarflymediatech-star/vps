import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
});

const dayAvailabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    date: {
        type: Date,
        required: true,
    },
    slots: [slotSchema],
});

const tutorAvailabilitySchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        weekStartDate: {
            type: Date,
            required: true,
        },
        availability: [dayAvailabilitySchema],
    },
    { timestamps: true }
);

// Index for faster queries
tutorAvailabilitySchema.index({ tutorId: 1, weekStartDate: 1 });

export default mongoose.model("TutorAvailability", tutorAvailabilitySchema);
