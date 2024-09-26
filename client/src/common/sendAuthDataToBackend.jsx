// src/common/sendAuthDataToBackend.js
import axios from 'axios';

const sendAuthDataToBackend = async (type, requestData) => {
  try {
    const endpoint = type === 'sign-up' ? '/signup' : '/signin';
    
    // Using the environment variable
    const response = await axios.post(`${import.meta.REACT_APP_API_URL}${endpoint}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Return the backend response data
  } catch (error) {
    // Log the detailed error
    console.error('API Call Error:', error.response || error.message || error);

    throw error.response ? error.response.data : new Error('Server Error');
  }
};

export default sendAuthDataToBackend;
