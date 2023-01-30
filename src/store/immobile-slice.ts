import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Documento } from "../entities/documento.model";
import { Filtro } from "../entities/filtro.model";
import { Immobile } from "../entities/immobile.model";
import { queryData } from "../entities/queryData";
import { getBase64StringFromByteArray } from "../utils/fileUtils";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "default",
    page: 1,
    update: 0,
};

interface ImmobileState {
    immobile: Immobile | null;
    queryData: queryData;
    isSelectionModeAllowed: boolean;
    isSelectionModeActivated: boolean;
    listIdPhotoSelected: number[];
}

const initialState = {
    immobile: null,
    queryData: INITIAL_QUERY_DATA,
    isSelectionModeAllowed: true,
    isSelectionModeActivated: false,
    listIdPhotoSelected: [],
} as ImmobileState;

const immobileSlice = createSlice({
    name: "immobile",
    initialState,
    reducers: {
        setImmobiliFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setImmobiliSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setImmobiliPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerImmobiliUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetImmobiliQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
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
        blockPhoto(state, action: PayloadAction<{ id: number }>) {
            const photo = state.immobile!.files?.find(
                (el) => el.id === action.payload.id
            );
            photo!.base64String = "fetching";
        },
        setPhoto(
            state,
            action: PayloadAction<{ id: number; byteArray: string }>
        ) {
            const photo = state.immobile!.files?.find(
                (el) => el.id === action.payload.id
            );
            photo!.base64String =
                action.payload.byteArray === "blockPhoto"
                    ? "blockPhoto"
                    : getBase64StringFromByteArray(
                          action.payload.byteArray,
                          photo!.codiceBucket!
                      );
        },
        erasePhoto(state, action: PayloadAction<{ id: number }>) {
            const photo = state.immobile!.files?.find(
                (el) => el.id === action.payload.id
            );
            photo!.base64String = "fetching";
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
        setIsSelectionModeAllowed(state, action: PayloadAction<boolean>) {
            state.isSelectionModeAllowed = action.payload;
        },
        setIsSelectionModeActivated(state, action: PayloadAction<boolean>) {
            state.isSelectionModeActivated = action.payload;
        },
        setListIdPhotoSelected(state, action: PayloadAction<number[]>) {
            state.listIdPhotoSelected = action.payload;
        },
        selectPhoto(state, action: PayloadAction<number>) {
            if (state.listIdPhotoSelected.length === 0)
                state.listIdPhotoSelected = [action.payload];
            const alreadyThere = state.listIdPhotoSelected.find(
                (el) => el === action.payload
            );
            if (!alreadyThere) state.listIdPhotoSelected.push(action.payload);
        },
        deselectPhoto(state, action: PayloadAction<number>) {
            state.listIdPhotoSelected = state.listIdPhotoSelected.filter(
                (el) => el !== action.payload
            );
        },
    },
});

export const {
    resetImmobiliQueryData,
    setImmobiliFilter,
    setImmobiliSorting,
    setImmobiliPaging,
    triggerImmobiliUpdate,
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
    blockPhoto,
    setIsSelectionModeAllowed,
    setIsSelectionModeActivated,
    setListIdPhotoSelected,
    selectPhoto,
    deselectPhoto,
} = immobileSlice.actions;
export default immobileSlice.reducer;
