import axios from "axios";
import { store } from "./app/store";


const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
  
})

api.interceptors.request.use((config) => {
  const { user } = store.getState().auth;
   
  if (user) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export default api;

