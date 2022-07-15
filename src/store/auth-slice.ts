import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    authToken: string | null;
}

const initialState = { authToken: "" } as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<string>) {
            localStorage.setItem("authToken", action.payload);
            state.authToken = action.payload;
        },
        logout(state) {
            localStorage.removeItem("authToken");
            state.authToken = null;
            console.log("Sono qui");
        },
        /* incrementByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload;
        }, */
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
