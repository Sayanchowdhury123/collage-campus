
import { configureStore } from "@reduxjs/toolkit";
import authReducer,{hydrateAuth} from "../features/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});


store.dispatch(hydrateAuth());