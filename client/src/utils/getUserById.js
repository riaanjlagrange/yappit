import api from './api';

const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
};

export default getUserById;
