import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { setPersona } from "./persona-slice";
import { changeLoading, setError } from "./ui-slice";

export const fetchPersonaById = createAsyncThunk(
    "personaDaId",
    async (personaId: number, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const res = await axiosInstance.get(`/persone/${personaId}`);
            dispatch(changeLoading(false));
            dispatch(setPersona(res.data));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "fetchPersonaById", object: e }));
        }
    }
);
