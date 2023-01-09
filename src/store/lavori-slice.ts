import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";

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
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
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
    },
});

export const {
    setLavoriFilter,
    setLavoriSorting,
    setLavoriPaging,
    triggerLavoriUpdate,
    resetLavoriQueryData,
} = lavoroSlice.actions;

export default lavoroSlice.reducer;
