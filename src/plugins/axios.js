import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Ensure the protocol is included
});

export default axiosInstance;
