import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const submitSupportRequest = async (data) => {
    const response = await axios.post(`${API_URL}/support/submit`, data);
    return response.data;
};
