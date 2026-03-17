import Review from "../models/Review.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const addReview = async (req, res) => {
  try {
    const { tutorId, rating, comment } = req.body;
    const studentId = req.user.id;

    if (!tutorId || !rating) {
      return res.status(400).json({ success: false, message: "Tutor ID and rating are required" });
    }

    // Check if the student has already reviewed this tutor
    const existingReview = await Review.findOne({ studentId, tutorId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: " You have already reviewed this tutor" });
    }

    // 1. Create the review
    const review = new Review({
      studentId,
      tutorId,
      rating,
      comment,
    });
    await review.save();

    // 2. Fetch tutor and update aggregate rating
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ success: false, message: "Tutor not found" });
    }

    const currentRating = tutor.rating || 0;
    const currentReviewsCount = tutor.reviewsCount || 0;
    
    const newReviewsCount = currentReviewsCount + 1;
    const newRating = ((currentRating * currentReviewsCount) + rating) / newReviewsCount;

    tutor.rating = Number(newRating.toFixed(1));
    tutor.reviewsCount = newReviewsCount;
    await tutor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error("addReview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("studentId", "name avatar")
      .populate("tutorId", "name avatar expertise")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("getLatestReviews error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTutorReviews = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const reviews = await Review.find({ tutorId })
      .populate("studentId", "name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("getTutorReviews error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
