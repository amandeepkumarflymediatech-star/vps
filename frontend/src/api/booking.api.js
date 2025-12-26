import api from "./axios";

export const bookTrialApi = (data) =>
  api.post("/bookings", data);
