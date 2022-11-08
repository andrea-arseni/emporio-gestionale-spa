import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import axiosInstance from "../utils/axiosInstance";
import { refresh } from "./appuntamenti-slice";
import { changeLoading, setError, setModalOpened } from "./ui-slice";

export const eliminaVisita = createAsyncThunk<any, any, { state: RootState }>(
    "eliminaVisita",
    async (_, { getState, dispatch }) => {
        const { currentVisit } = getState().appuntamenti;
        dispatch(changeLoading(true));
        try {
            await axiosInstance.delete(`/visite/${currentVisit!.id}`);
            dispatch(setModalOpened(false));
            dispatch(refresh());
        } catch (e) {
            dispatch(changeLoading(false));
            setTimeout(() => {
                dispatch(setError({ name: "eliminaVisita", object: e }));
            }, 200);
        }
    }
);

export const alertEliminaVisita = createAsyncThunk<
    any,
    any,
    { state: RootState }
>("alertEliminaVisita", async (presentAlert, { dispatch }) => {
    presentAlert({
        header: "Sei sicuro?",
        message: `La cancellazione della visita è irreversibile.`,
        buttons: [
            {
                text: "Procedi",
                handler: () => dispatch(eliminaVisita(null)),
            },
            {
                text: "Indietro",
                role: "cancel",
            },
        ],
    });
});
