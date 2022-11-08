import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Visit } from "../entities/visit.model";

type pageMode = "calendario" | "lista";
interface AppuntamentiState {
    tooltipActivated: string | null;
    currentVisit: Visit | null;
    pageMode: pageMode;
    isFormActive: boolean;
    trigger: number;
}

const initialState = {
    tooltipActivated: null,
    currentVisit: null,
    pageMode: "calendario",
    trigger: 0,
    isFormActive: false,
} as AppuntamentiState;

const appuntamentiSlice = createSlice({
    name: "appuntamenti",
    initialState,
    reducers: {
        setTooltip(state, action: PayloadAction<string | null>) {
            state.tooltipActivated = action.payload;
        },
        setCurrentVisit(state, action: PayloadAction<Visit | null>) {
            state.currentVisit = action.payload;
        },
        setPageMode(state, action: PayloadAction<pageMode>) {
            state.pageMode = action.payload;
        },
        setFormActive(state, action: PayloadAction<boolean>) {
            state.isFormActive = action.payload;
        },
        backToList(state) {
            state.currentVisit = null;
            state.isFormActive = false;
        },
        refresh(state) {
            ++state.trigger;
        },
    },
});

export const {
    setTooltip,
    setCurrentVisit,
    setPageMode,
    backToList,
    refresh,
    setFormActive,
} = appuntamentiSlice.actions;
export default appuntamentiSlice.reducer;
