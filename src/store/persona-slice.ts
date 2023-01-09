import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { Persona } from "../entities/persona.model";
import { queryData } from "../entities/queryData";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "status",
    page: 1,
    update: 0,
};
interface PersonaState {
    persona: Persona | null;
    queryData: queryData;
}

const initialState = {
    persona: null,
    queryData: INITIAL_QUERY_DATA,
} as PersonaState;

const PersonaSlice = createSlice({
    name: "Persona",
    initialState,
    reducers: {
        setPersona(state, action: PayloadAction<Persona | null>) {
            state.persona = action.payload;
        },
        setPersoneFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setPersoneSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setPersonePaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerPersoneUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetPersoneQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setPersona,
    setPersoneFilter,
    setPersoneSorting,
    setPersonePaging,
    triggerPersoneUpdate,
    resetPersoneQueryData,
} = PersonaSlice.actions;
export default PersonaSlice.reducer;
