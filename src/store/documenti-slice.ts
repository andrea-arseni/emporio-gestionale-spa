import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "nome",
    page: 1,
    update: 0,
};

interface DocumentoState {
    queryData: queryData;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
} as DocumentoState;

const documentoSlice = createSlice({
    name: "documento",
    initialState,
    reducers: {
        setDocumentiFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setDocumentiSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setDocumentiPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerDocumentiUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetDocumentiQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setDocumentiFilter,
    setDocumentiSorting,
    setDocumentiPaging,
    triggerDocumentiUpdate,
    resetDocumentiQueryData,
} = documentoSlice.actions;

export default documentoSlice.reducer;
