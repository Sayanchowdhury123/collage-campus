
import { configureStore } from "@reduxjs/toolkit";
import authReducer,{hydrateAuth} from "../features/authslice";
import profileReducer from "../features/profileSlice";
import postSlice from "../features/PostSlice"
import HomeSlice from "../features/HomeSlice"
import GroupSlice from "../features/GroupSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    post: postSlice,
    home:HomeSlice,
    group:GroupSlice
  },
});


store.dispatch(hydrateAuth());