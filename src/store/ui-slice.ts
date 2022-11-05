import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type errorType = { object: any; name: string } | null;

interface UIState {
    isLoading: boolean;
    error: errorType;
    isModalOpened: boolean;
}

const initialState = {
    isLoading: false,
    error: null,
    isModalOpened: false,
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
        setModalOpened(state, action: PayloadAction<boolean>) {
            state.isModalOpened = action.payload;
        },
    },
});

export const { changeLoading, setError, setModalOpened } = UISlice.actions;
export default UISlice.reducer;
