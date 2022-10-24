import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosSecondaryApi from "../utils/axiosSecondaryApi";
import { changeLoading, setError } from "./ui-slice";

export const createReportOnServer = createAsyncThunk(
    "createReport",
    async (input: { url: string; from: string; to: string }, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const reqBody = { from: input.from, to: input.to };
            await axiosSecondaryApi.post(input.url, reqBody);
            dispatch(changeLoading(false));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "createReport", object: e }));
        }
    }
);
