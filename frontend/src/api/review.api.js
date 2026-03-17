import axiosInstance from "./axios.instance";

export const addReview = (reviewData) => {
  return axiosInstance.post("/reviews", reviewData);
};

export const getLatestReviews = () => {
  return axiosInstance.get("/reviews/latest");
};

export const getTutorReviews = (tutorId) => {
  return axiosInstance.get(`/reviews/tutor/${tutorId}`);
};
