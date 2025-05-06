import { baseAPI } from "@/utils/variables";
import axios from "axios";

const API = axios.create({
  baseURL: baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default API;
