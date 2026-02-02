
import { configureStore } from "@reduxjs/toolkit";
import authReducer,{hydrateAuth} from "../features/authslice";
import profileReducer from "../features/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});


store.dispatch(hydrateAuth());