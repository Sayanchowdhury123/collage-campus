import axios from "axios";
import { store } from "./app/store";


const api = axios.create({
    baseURL: `http://localhost:9000`,
  
})

api.interceptors.request.use((config) => {
  const { user } = store.getState().auth;

  if (user) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export default api;

