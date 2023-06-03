import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";
import { Lavoro } from "../entities/lavoro.model";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "status",
    page: 1,
    update: 0,
};

interface lavoroState {
    queryData: queryData;
    currentLavoro: Lavoro | null;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
    currentLavoro: null,
} as lavoroState;

const lavoroSlice = createSlice({
    name: "lavoro",
    initialState,
    reducers: {
        setLavoriFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setLavoriSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setLavoriPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerLavoriUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetLavoriQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
        setCurrentLavoro(state, action: PayloadAction<Lavoro | null>) {
            state.currentLavoro = action.payload;
        },
    },
});

export const {
    setLavoriFilter,
    setLavoriSorting,
    setLavoriPaging,
    triggerLavoriUpdate,
    resetLavoriQueryData,
    setCurrentLavoro,
} = lavoroSlice.actions;

export default lavoroSlice.reducer;
