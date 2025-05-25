import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Change this for production or ngrok

export const fetchTickets = async (filters = {}) => {
  try {
    const params = {};

    if (filters.team) params.team = filters.team;
    if (filters.priority) params.priority = filters.priority;
    if (filters.fromDate)
      params.fromDate = new Date(filters.fromDate).toISOString();
    if (filters.toDate) params.toDate = new Date(filters.toDate).toISOString();

    const response = await axios.get(`${BASE_URL}/tickets`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};
