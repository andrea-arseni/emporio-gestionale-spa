import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type errorType = { object: any; name: string } | null;

interface UIState {
    isLoading: boolean;
    error: errorType;
}

const initialState = {
    isLoading: false,
    error: null,
} as UIState;

const UISlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        changeLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<errorType>) {
            state.error = action.payload;
        },
    },
});

export const { changeLoading, setError } = UISlice.actions;
export default UISlice.reducer;
