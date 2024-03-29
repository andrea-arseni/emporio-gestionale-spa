import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import {
    addSignedPhoto,
    blockPhoto,
    resetMovingPhotos,
    ripristinaImmobile,
    setImmobile,
    setPhoto,
    swapPhotos,
    updateReports,
} from "./immobile-slice";
import { changeLoading, setError } from "./ui-slice";
import { isNativeApp } from "../utils/contactUtils";
import localforage from "localforage";
import { Directory, Filesystem } from "@capacitor/filesystem";

export const fetchImmobileById = createAsyncThunk(
    "immobileDaId",
    async (immobileId: number, { dispatch }) => {
        dispatch(changeLoading(true));
        try {
            const res = await axiosInstance.get(`/immobili/${immobileId}`);
            dispatch(changeLoading(false));
            const immobile = res.data;
            immobile.caratteristiche = res.data.caratteristicheImmobile;
            dispatch(setImmobile(immobile));
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

const fetchFile = async (url: string, dispatch: any, id: number) => {
    const res = await axiosInstance.get(url);
    dispatch(
        setPhoto({
            byteArray: res.data.byteArray,
            id,
        })
    );
};

const setFileNotAvailable = (dispatch: any, id: number) => {
    dispatch(
        setPhoto({
            byteArray: "blockPhoto",
            id,
        })
    );
};

export const fetchFileById = createAsyncThunk(
    "fileDaId",
    async (url: string, { dispatch }) => {
        const id = +url.split("/").pop()!;
        dispatch(blockPhoto({ id }));
        try {
            fetchFile(url, dispatch, id);
        } catch (e: any) {
            await new Promise((r) => setTimeout(r, 1500));
            try {
                fetchFile(url, dispatch, id);
            } catch (e) {
                await new Promise((r) => setTimeout(r, 3000));
                try {
                    fetchFile(url, dispatch, id);
                } catch (e) {
                    setFileNotAvailable(dispatch, id);
                }
            }
        }
    }
);

export const swapPhotoPositions = createAsyncThunk(
    "swapPhotoPositions",
    async (
        input: { url: string; firstName: string; secondName: string },
        { dispatch }
    ) => {
        dispatch(changeLoading(true));
        try {
            await axiosInstance.patch(input.url, {
                name: input.firstName,
            });
            dispatch(changeLoading(false));
            if (input.firstName === "1" || input.secondName === "1") {
                const immobileId = input.url.split("/")[2];
                try {
                    if (isNativeApp) {
                        await Filesystem.deleteFile({
                            directory: Directory.Cache,
                            path: `/immobile/${immobileId}/avatar.jpg`,
                        });
                    } else {
                        await localforage.removeItem(
                            `/immobile/${immobileId}/avatar.jpg`
                        );
                    }
                } catch (e) {}
            }
            const idFile = input.url.split("/").pop()!;
            dispatch(resetMovingPhotos());
            dispatch(swapPhotos({ idFile, nuovoNome: input.firstName }));
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
            try {
                if (isNativeApp) {
                    await Filesystem.deleteFile({
                        directory: Directory.Cache,
                        path: `/immobile/${id}/avatar.jpg`,
                    });
                } else {
                    await localforage.removeItem(`/immobile/${id}/avatar.jpg`);
                }
            } catch (e) {}
            dispatch(changeLoading(false));
            dispatch(ripristinaImmobile());
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "ripristinaImmobile", object: e }));
        }
    }
);
