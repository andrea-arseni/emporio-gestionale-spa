import { configureStore } from "@reduxjs/toolkit";
import appuntamentiSlice from "./appuntamenti-slice";

import authReducer from "./auth-slice";
import immobileReducer from "./immobile-slice";
import personaSlice from "./persona-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        immobile: immobileReducer,
        ui: uiSlice,
        persona: personaSlice,
        appuntamenti: appuntamentiSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
