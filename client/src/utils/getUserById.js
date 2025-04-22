import api from "./api";

const getUserNameById = async (userId) => {
  try {
    console.log("Fetching user name for ID:", userId);
    const response = await api.get(`/users/${userId}`);
    return response.data.name;
  } catch (err) {
    console.error("Error fetching user:", err);
    return "Unknown Author";
  }
};

export default getUserNameById;
