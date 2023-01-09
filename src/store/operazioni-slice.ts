import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "data",
    page: 1,
    update: 0,
};

interface operazioniState {
    queryData: queryData;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
} as operazioniState;

const operazioniSlice = createSlice({
    name: "operazioni",
    initialState,
    reducers: {
        setOperazioniFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setOperazioniSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setOperazioniPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerOperazioniUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetOperazioniQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setOperazioniFilter,
    setOperazioniSorting,
    setOperazioniPaging,
    triggerOperazioniUpdate,
    resetOperazioniQueryData,
} = operazioniSlice.actions;

export default operazioniSlice.reducer;
