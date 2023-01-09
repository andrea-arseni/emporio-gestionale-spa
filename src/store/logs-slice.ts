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

interface logState {
    queryData: queryData;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
} as logState;

const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        setLogsFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setLogsSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setLogsPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerLogsUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetLogsQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setLogsFilter,
    setLogsSorting,
    setLogsPaging,
    triggerLogsUpdate,
    resetLogsQueryData,
} = logSlice.actions;

export default logSlice.reducer;
