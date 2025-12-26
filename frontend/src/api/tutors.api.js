import api from "./axios";

export const getTutorsApi = () => api.get("/tutors");
