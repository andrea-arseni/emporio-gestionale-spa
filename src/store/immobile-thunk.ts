import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import {
    addSignedPhoto,
    blockPhoto,
    ripristinaImmobile,
    setImmobile,
    setPhoto,
    swapPhotos,
    updateReports,
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

export const performUpdateReports = createAsyncThunk(
    "updateReports",
    async (immobileId: number, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const res = await axiosInstance.get(`/immobili/${immobileId}`);
            dispatch(changeLoading(false));
            dispatch(updateReports(res.data));
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
        const id = +url.split("/").pop()!;
        dispatch(blockPhoto({ id }));
        try {
            const res = await axiosInstance.get(url);
            dispatch(
                setPhoto({
                    byteArray: res.data.byteArray,
                    id: res.data.file.id,
                })
            );
        } catch (e) {
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

export const performRipristinaImmobile = createAsyncThunk(
    "ripristinaImmobile",
    async (id: number, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            await axiosInstance.patch(`/immobili/${id}/files/ripristina`, {});
            dispatch(changeLoading(false));
            dispatch(ripristinaImmobile());
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "ripristinaImmobile", object: e }));
        }
    }
);
