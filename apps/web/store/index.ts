import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import missionReducer from "./slices/missionSlice";
import companyReducer from "./slices/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionReducer,
    company: companyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // getState fonction envoie tout l'etat de store redux
export type AppDispatch = typeof store.dispatch; // dispatch il permet d'envoyer des actions dans redux

// Hooks pour eviter de taper useDispatch/useSelector partout

export const useAppDispatch = () => useDispatch<AppDispatch>(); // pour lire
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // pour modifier
