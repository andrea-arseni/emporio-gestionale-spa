import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Caratteristiche } from "../entities/caratteristiche.model";
import { Documento } from "../entities/documento.model";
import { Immobile } from "../entities/immobile.model";

interface HousesState {
    houses: Immobile[];
}

const initialState = {
    houses: [],
} as HousesState;

const houseSlice = createSlice({
    name: "houses",
    initialState,
    reducers: {
        addHouses(state, action: PayloadAction<Immobile[]>) {
            action.payload.forEach((newHouse) => {
                const alreadyThere = state.houses.find(
                    (el) => el.id === newHouse.id
                );
                if (!alreadyThere)
                    state.houses.push({ ...newHouse, fileFetched: false });
            });
        },
        addImage(
            state,
            action: PayloadAction<{ id: number; file: Documento }>
        ) {
            const houseIndex = state.houses.findIndex(
                (el) => el.id === action.payload.id
            );
            if (houseIndex === -1) throw new Error("Casa non trovata");
            const fileIndex = state.houses[houseIndex].files!.findIndex(
                (el) => action.payload.file.id === el.id
            );
            if (fileIndex === -1) throw new Error("File non trovato");
            state.houses[houseIndex].files![fileIndex].base64String =
                action.payload.file.base64String;
        },
        addCaratteristiche(
            state,
            action: PayloadAction<{
                id: number;
                caratteristiche: Caratteristiche;
            }>
        ) {
            const houseIndex = state.houses.findIndex(
                (el) => el.id === action.payload.id
            );
            if (houseIndex === -1) throw new Error("Casa non trovata");
            state.houses[houseIndex].caratteristiche =
                action.payload.caratteristiche;
        },
        addFiles(
            state,
            action: PayloadAction<{ id: number; files: Documento[] }>
        ) {
            let files =
                action.payload.files.length > 1
                    ? action.payload.files.slice(1)
                    : [];
            const houseIndex = state.houses.findIndex(
                (el) => el.id === action.payload.id
            );
            if (houseIndex === -1) throw new Error("Casa non trovata");
            state.houses[houseIndex].files!.forEach((originalEl) => {
                files = files.filter((el) => {
                    return el.id !== originalEl.id;
                });
            });
            state.houses[houseIndex].files = [
                ...state.houses[houseIndex].files!,
                ...files,
            ];
            state.houses[houseIndex].fileFetched = true;
        },
    },
});

export const { addHouses, addImage, addCaratteristiche, addFiles } =
    houseSlice.actions;
export default houseSlice.reducer;
