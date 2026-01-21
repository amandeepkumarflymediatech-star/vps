import API from "./axios.instance";

/**
 * Get tutor's availability for a specific week
 * @param {string} date - Optional ISO date string for week start (Monday)
 */
export const getTutorAvailability = (date) => {
  const params = date ? date : {};
  return API.get("/tutor/availability/my", { params });
};

/**
 * Save or update tutor's availability
 * @param {object} data - { weekStartDate, availability }
 */
export const saveTutorAvailability = (data) => {
  return API.post("/tutor/availability", data);
};

/**
 * Delete tutor's availability
 * @param {string} id - Availability document ID
 */
export const deleteTutorAvailability = (id) => {
  return API.delete(`/tutor/availability/${id}`);
};

/**
 * Get availability by tutor ID (public endpoint for students)
 * @param {string} tutorId - Tutor's user ID
 * @param {string} weekStartDate - Optional ISO date string for week start
 */
export const getAvailabilityByTutorId = (tutorId, weekStartDate) => {
  const params = weekStartDate ? { weekStartDate } : {};
  return API.get(`/tutor/${tutorId}/availability`, { params });
};

export default {
  getTutorAvailability,
  saveTutorAvailability,
  deleteTutorAvailability,
  getAvailabilityByTutorId,
};
