import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Documento } from "../entities/documento.model";
import { Immobile } from "../entities/immobile.model";
import { Visit } from "../entities/visit.model";
import { getBase64StringFromByteArray } from "../utils/fileUtils";

interface ImmobileState {
    immobile: Immobile | null;
    visite: Visit[];
}

const initialState = {
    immobile: null,
} as ImmobileState;

const immobileSlice = createSlice({
    name: "immobile",
    initialState,
    reducers: {
        setImmobile(state, action: PayloadAction<Immobile | null>) {
            state.immobile = action.payload;
        },
        updateReports(state, action: PayloadAction<Immobile>) {
            if (!state.immobile) return;
            if (!state.immobile.files) state.immobile.files = [];
            const reports = action.payload.files!.filter(
                (el) => el.tipologia === "REPORT"
            );
            state.immobile.files = state.immobile?.files?.filter(
                (el) => el.tipologia !== "REPORT"
            );
            state.immobile.files = state.immobile.files.concat(reports);
        },
        deleteFile(state, action: PayloadAction<number | null>) {
            const index = state.immobile?.files?.findIndex(
                (el) => el.id === action.payload
            );
            if (index || index === 0) state.immobile?.files?.splice(index, 1);
        },
        addSignedPhoto(
            state,
            action: PayloadAction<{ byteArray: string; file: Documento }>
        ) {
            const file = action.payload.file;
            state.immobile?.files?.unshift(
                new Documento(
                    file.id,
                    "0",
                    "FOTO",
                    file.codiceBucket,
                    undefined,
                    undefined,
                    getBase64StringFromByteArray(
                        action.payload.byteArray,
                        file.codiceBucket!
                    )
                )
            );
        },
        setPhoto(
            state,
            action: PayloadAction<{ id: number; byteArray: string }>
        ) {
            const photo = state.immobile!.files?.find(
                (el) => el.id === action.payload.id
            );
            photo!.base64String = getBase64StringFromByteArray(
                action.payload.byteArray,
                photo!.codiceBucket!
            );
        },
        erasePhoto(state, action: PayloadAction<{ id: number }>) {
            const photo = state.immobile!.files?.find(
                (el) => el.id === action.payload.id
            );
            photo!.base64String = undefined;
        },
        swapPhotos(
            state,
            action: PayloadAction<{ idFile: string; nuovoNome: string }>
        ) {
            // FOTO 1 with nome = nuovoNome - get id
            const photoOne = state.immobile!.files?.find(
                (el) => el.nome === action.payload.nuovoNome
            );
            // FOTO 2 get photo with id = idFile - get nome
            const photoTwo = state.immobile!.files?.find(
                (el) => el.id === +action.payload.idFile
            );
            // assign FOTO 1 nome trovato
            photoOne!.nome = photoTwo!.nome;
            // assign FOTO 2 nuovoNome
            photoTwo!.nome = action.payload.nuovoNome;
        },
        ripristinaImmobile(state) {
            const index = state.immobile!.files?.findIndex(
                (el) => el.tipologia === "FOTO" && el.nome === "0"
            );
            state.immobile?.files?.splice(index!, 1);
        },
        addFile(state, action: PayloadAction<Documento>) {
            state.immobile?.files?.push(action.payload);
        },
        renameFile(
            state,
            action: PayloadAction<{ id: number; newName: string }>
        ) {
            if (
                !state.immobile ||
                !state.immobile.files ||
                state.immobile.files.length === 0
            )
                return;
            const index = state.immobile.files.findIndex(
                (el) => el.id === action.payload.id
            );
            if (index === -1) return;
            state.immobile.files[index].nome = action.payload.newName;
        },
    },
});

export const {
    setImmobile,
    setPhoto,
    erasePhoto,
    swapPhotos,
    deleteFile,
    addSignedPhoto,
    ripristinaImmobile,
    addFile,
    renameFile,
    updateReports,
} = immobileSlice.actions;
export default immobileSlice.reducer;
