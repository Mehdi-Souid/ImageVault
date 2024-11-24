import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users';  // Ensure this points to the correct base URL for user routes

const authService = {
  // Sign-up function
  signUp: async (username, password) => {
    try {
      const response = await axios.post(API_URL, { username, password });
      return response.data;  // Response from the API after user creation
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;  // You may want to handle errors gracefully in the UI
    }
  },

  // Sign-in function
  signIn: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, { username, password });
      return response.data;  // Response from the API after sign-in attempt
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;  // Handle errors gracefully
    }
  },
};

export default authService;
