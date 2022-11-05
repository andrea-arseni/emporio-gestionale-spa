import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    authToken: string | null;
}

interface loginData {
    token: string;
    userData: {
        email: string;
        name: string;
        role: string;
    };
}

const initialState = {
    authToken: localStorage.getItem("authToken")
        ? localStorage.getItem("authToken")
        : "",
} as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<loginData>) {
            localStorage.setItem("authToken", action.payload.token);
            localStorage.setItem(
                "userData",
                JSON.stringify(action.payload.userData)
            );
            state.authToken = action.payload.token;
        },
        logout(state) {
            localStorage.removeItem("authToken");
            state.authToken = null;
        },
        /* incrementByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload;
        }, */
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
