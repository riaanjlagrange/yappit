import api from "./api";

const getUserNameById = (userId) => {
  try {
    api.get(`/users/${userId}`).then((response) => {
      return response.data.name;
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return "Unknown Author";
  }
};

export default getUserNameById;
