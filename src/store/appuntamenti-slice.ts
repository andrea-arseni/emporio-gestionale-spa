import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Visit } from "../entities/visit.model";

type pageMode = "calendario" | "lista" | "form";
interface AppuntamentiState {
    tooltipActivated: string | null;
    currentVisit: Visit | null;
    pageMode: pageMode;
    trigger: number;
}

const initialState = {
    tooltipActivated: null,
    currentVisit: null,
    pageMode: "calendario",
    trigger: 0,
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
        backToList(state) {
            state.currentVisit = null;
            state.pageMode = "calendario";
        },
        refresh(state) {
            ++state.trigger;
        },
    },
});

export const { setTooltip, setCurrentVisit, setPageMode, backToList, refresh } =
    appuntamentiSlice.actions;
export default appuntamentiSlice.reducer;
