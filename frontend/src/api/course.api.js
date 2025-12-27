import api from "./axios";

export const getCourses = () => {
  return api.get("/courses");
};
