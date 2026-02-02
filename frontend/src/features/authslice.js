
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
    authStart: (state) => {
      state.loading = true;
      
    },
  
    authSuccess: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.loading = false;
      
      localStorage.setItem("campus-user", JSON.stringify(user));
      
    },
   
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("campus-user");
     
    },
   
    authFailure: (state) => {
      state.loading = false;
      
    },
  
    hydrateAuth: (state) => {
      const user = localStorage.getItem("campus-user");
      
      if (user) {
        state.user = JSON.parse(user);
    
      }
    },
  },
});

export const { authStart, authSuccess, logout, authFailure, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;