import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userData {
    email: string;
    name: string;
    role: string;
}

export interface loginData {
    token: string;
    userData: userData;
}

interface AuthState {
    authToken: string | null;
    userData: userData | null;
}

const initialState = {
    authToken: null,
    userData: null,
} as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<loginData>) {
            state.authToken = action.payload.token;
            state.userData = action.payload.userData;
        },
        logout(state) {
            state.authToken = null;
            state.userData = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
