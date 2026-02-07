
import { configureStore } from "@reduxjs/toolkit";
import authReducer,{hydrateAuth} from "../features/authslice";
import profileReducer from "../features/profileSlice";
import postSlice from "../features/PostSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    post: postSlice
  },
});


store.dispatch(hydrateAuth());