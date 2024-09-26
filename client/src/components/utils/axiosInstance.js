// src/utils/axiosInstance.js
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // Assuming you have the backend URL in an environment variable
  timeout: 5000,  // Optional: Set a timeout for requests
});

export default axiosInstance;
