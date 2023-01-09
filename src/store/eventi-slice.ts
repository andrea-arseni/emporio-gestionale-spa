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

interface eventoState {
    queryData: queryData;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
} as eventoState;

const eventoSlice = createSlice({
    name: "evento",
    initialState,
    reducers: {
        setEventiFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setEventiSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setEventiPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerEventiUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetEventiQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setEventiFilter,
    setEventiSorting,
    setEventiPaging,
    triggerEventiUpdate,
    resetEventiQueryData,
} = eventoSlice.actions;

export default eventoSlice.reducer;
