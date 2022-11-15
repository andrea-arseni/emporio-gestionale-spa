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
    autoLoginDone: boolean;
}

const initialState = {
    authToken: null,
    userData: null,
    autoLoginDone: false,
} as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        autologin(state, action: PayloadAction<loginData>) {
            state.authToken = action.payload.token;
            state.userData = action.payload.userData;
            state.autoLoginDone = true;
        },
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

export const { login, logout, autologin } = authSlice.actions;
export default authSlice.reducer;
