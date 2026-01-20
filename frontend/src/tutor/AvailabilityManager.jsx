"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Save, Loader2, CheckCircle2 } from "lucide-react";
import {
    getTutorAvailability,
    saveTutorAvailability,
} from "@/api/tutorAvailability.api";

// Generate time slots from 9 AM to 10 PM (13 slots)
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
        const startTime = `${String(hour).padStart(2, "0")}:00`;
        const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

        // Format label
        let label;
        if (hour < 12) {
            label = `${hour}:00 AM - ${hour + 1}:00 AM`;
        } else if (hour === 12) {
            label = `12:00 PM - 1:00 PM`;
        } else if (hour < 21) {
            label = `${hour - 12}:00 PM - ${hour - 11}:00 PM`;
        } else {
            label = `9:00 PM - 10:00 PM`;
        }

        slots.push({
            startTime,
            endTime,
            label,
        });
    }
    return slots;
};

// Get week dates (7 days starting from today)
const getWeekDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const week = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayIndex = date.getDay();

        week.push({
            day: dayNames[dayIndex],
            dayShort: dayNames[dayIndex],
            date: date,
            dateString: date.toISOString().split("T")[0],
            dateNum: date.getDate(),
        });
    }

    return { week, monday: today }; // Return today as the start date
};

const AvailabilityManager = () => {
    const timeSlots = generateTimeSlots();
    const { week, monday } = getWeekDates();

    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [selectedDate, setSelectedDate] = useState(week[0].dateString);

    // Load existing availability
    useEffect(() => {
        const loadAvailability = async () => {
            try {
                setLoading(true);
                const response = await getTutorAvailability(
                    monday.toISOString().split("T")[0]
                );

                if (response.data?.data?.availability) {
                    // Convert API data to state format
                    const availabilityMap = {};
                    response.data.data.availability.forEach((day) => {
                        const dateStr = new Date(day.date).toISOString().split("T")[0];
                        availabilityMap[dateStr] = {};
                        day.slots.forEach((slot) => {
                            availabilityMap[dateStr][slot.startTime] = slot.isAvailable;
                        });
                    });
                    setAvailability(availabilityMap);
                }
            } catch (error) {
                console.error("Error loading availability:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAvailability();
    }, []);

    // Toggle slot availability
    const toggleSlot = (dateString, startTime) => {
        setAvailability((prev) => ({
            ...prev,
            [dateString]: {
                ...prev[dateString],
                [startTime]: !prev[dateString]?.[startTime],
            },
        }));
        setSaved(false);
    };

    // Save availability
    const handleSave = async () => {
        try {
            setSaving(true);

            // Convert state to API format
            const availabilityData = week.map((day) => ({
                day: day.day,
                date: day.date.toISOString(),
                slots: timeSlots.map((slot) => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: availability[day.dateString]?.[slot.startTime] || false,
                })),
            }));

            await saveTutorAvailability({
                weekStartDate: monday.toISOString().split("T")[0],
                availability: availabilityData,
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving availability:", error);
            alert("Failed to save availability. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="text-blue-600" size={24} />
                        Manage Availability
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Select your available time slots for the week
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${saved
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save
                        </>
                    )}
                </button>
            </div>

            {/* Date Selector */}
            <div className="mb-6">
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                    {week.map((day) => (
                        <button
                            key={day.dateString}
                            onClick={() => setSelectedDate(day.dateString)}
                            className={`flex-shrink-0 min-w-[70px] md:min-w-[80px] rounded-xl px-4 py-3 text-center font-semibold transition-all ${selectedDate === day.dateString
                                ? "bg-[#6335F8] text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#6335F8]"
                                }`}
                        >
                            <div className="text-xs mb-1">{day.dayShort}</div>
                            <div className="text-lg font-bold">{day.dateNum}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Choose your timing
                </h3>
                <p className="text-sm text-gray-600">
                    Click on time slots to mark them as available. Selected slots will be highlighted.
                </p>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                    const isAvailable = availability[selectedDate]?.[slot.startTime];
                    return (
                        <button
                            key={slot.startTime}
                            onClick={() => toggleSlot(selectedDate, slot.startTime)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${isAvailable
                                ? "bg-[#6335F8] border-[#6335F8] text-white shadow-md"
                                : "bg-white border-gray-200 text-gray-700 hover:border-[#6335F8]"
                                }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isAvailable
                                    ? "border-white bg-white"
                                    : "border-gray-400 bg-white"
                                    }`}
                            >
                                {isAvailable && (
                                    <div className="w-3 h-3 rounded-full bg-[#6335F8]"></div>
                                )}
                            </div>
                            <span className="text-sm font-medium">{slot.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900">
                            {Object.values(availability[selectedDate] || {}).filter(Boolean).length} slots selected for{" "}
                            {week.find(d => d.dateString === selectedDate)?.day}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                            Students will only be able to book the time slots you mark as available.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityManager;
