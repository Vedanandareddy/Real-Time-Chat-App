import axios from "axios";

export const axiosInstance=axios.create({
    baseURL: import.meta.env.MODE==="developmetn"?"http://localhost:5001/api":"/api",  // if in production /api of the current base url
    withCredentials:true, // sends cookies on every request 
})