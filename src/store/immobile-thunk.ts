import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import {
    addSignedPhoto,
    setImmobile,
    setPhoto,
    swapPhotos,
} from "./immobile-slice";
import { changeLoading, setError } from "./ui-slice";

export const fetchImmobileById = createAsyncThunk(
    "immobileDaId",
    async (immobileId: number, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const res = await axiosInstance.get(`/immobili/${immobileId}`);
            dispatch(changeLoading(false));
            dispatch(setImmobile(res.data));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "fetchImmobileById", object: e }));
        }
    }
);

export const fetchFotoFirmata = createAsyncThunk(
    "fetchFotoFirmata",
    async (immobileId: number, { dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/immobili/${immobileId}/fotofirmata`
            );
            dispatch(changeLoading(false));
            dispatch(addSignedPhoto(res.data));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "fetchFotoFirmata", object: e }));
        }
    }
);

export const fetchFileById = createAsyncThunk(
    "fileDaId",
    async (url: string, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const res = await axiosInstance.get(url);
            dispatch(changeLoading(false));
            dispatch(
                setPhoto({
                    byteArray: res.data.byteArray,
                    id: res.data.file.id,
                })
            );
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "fetchFileById", object: e }));
        }
    }
);

export const swapPhotoPositions = createAsyncThunk(
    "swapPhotoPositions",
    async (input: { url: string; name: string }, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            await axiosInstance.patch(input.url, {
                name: input.name,
            });
            dispatch(changeLoading(false));
            const idFile = input.url.split("/").pop()!;
            dispatch(swapPhotos({ idFile, nuovoNome: input.name }));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "swapPhotoPositions", object: e }));
        }
    }
);
