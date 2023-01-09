import { configureStore } from "@reduxjs/toolkit";
import appuntamentiSlice from "./appuntamenti-slice";
import authReducer from "./auth-slice";
import immobileReducer from "./immobile-slice";
import documentoReducer from "./documenti-slice";
import eventoReducer from "./eventi-slice";
import lavoroReducer from "./lavori-slice";
import logReducer from "./logs-slice";
import operazioniReducer from "./operazioni-slice";
import stepsReducer from "./steps-slice";
import personaSlice from "./persona-slice";
import uiSlice from "./ui-slice";
import publicImmobileReducer from "./public-immobile-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        immobile: immobileReducer,
        documento: documentoReducer,
        evento: eventoReducer,
        lavoro: lavoroReducer,
        log: logReducer,
        operazione: operazioniReducer,
        steps: stepsReducer,
        ui: uiSlice,
        persona: personaSlice,
        appuntamenti: appuntamentiSlice,
        publicImmobile: publicImmobileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
