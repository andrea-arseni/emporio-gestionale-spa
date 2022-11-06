/* const confermaEliminaVisita = async () => {
        try {
            setShowLoading(true);
            await axiosInstance.delete("/visite/" + props.visita!.id);
            //setModalIsOpen(false);
            setTimeout(() => {
                //doUpdate((prevState) => ++prevState);
            }, 300);
        } catch (e) {
            //setModalIsOpen(false);
            setShowLoading(false);
            setTimeout(() => {
                errorHandler(
                    e,
                    () => {},
                    "Cancellazione non riuscita",
                    presentAlert
                );
            }, 300);
        }
    }; */

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
