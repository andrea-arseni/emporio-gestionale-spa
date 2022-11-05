import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppuntamentiState {
    tooltipActivated: string | null;
}

const initialState = {
    tooltipActivated: null,
} as AppuntamentiState;

const appuntamentiSlice = createSlice({
    name: "appuntamenti",
    initialState,
    reducers: {
        setTooltip(state, action: PayloadAction<string | null>) {
            console.log(action);
            state.tooltipActivated = action.payload;
        },
    },
});

export const { setTooltip } = appuntamentiSlice.actions;
export default appuntamentiSlice.reducer;
