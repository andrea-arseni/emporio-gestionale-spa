import { NativeStorage } from "@awesome-cordova-plugins/native-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isNativeApp } from "../utils/contactUtils";
import { login, logout, loginData, autologin } from "./auth-slice";

export const performAutoLogin = createAsyncThunk(
    "autoLogin",
    async (_, { dispatch }) => {
        if (isNativeApp) {
            const token = await NativeStorage.getItem("authToken");
            const userDataStringified = await NativeStorage.getItem("userData");
            const userData = userDataStringified
                ? JSON.parse(userDataStringified)
                : null;
            if (token && userData) {
                const loginData: loginData = { token, userData };
                dispatch(autologin(loginData));
            }
        } else {
            const token = localStorage.getItem("authToken");
            const userData = localStorage.getItem("userData")
                ? JSON.parse(localStorage.getItem("userData")!)
                : null;
            if (token && userData) {
                const loginData: loginData = { token, userData };
                dispatch(autologin(loginData));
            }
        }
    }
);

export const performLogin = createAsyncThunk(
    "login",
    async (loginData: loginData, { dispatch }) => {
        if (isNativeApp) {
            await NativeStorage.setItem("authToken", loginData.token);
            await NativeStorage.setItem(
                "userData",
                JSON.stringify(loginData.userData)
            );
            dispatch(login(loginData));
        } else {
            localStorage.setItem("authToken", loginData.token);
            localStorage.setItem(
                "userData",
                JSON.stringify(loginData.userData)
            );
            dispatch(login(loginData));
        }
    }
);

export const performLogout = createAsyncThunk(
    "logout",
    async (_, { dispatch }) => {
        if (isNativeApp) {
            await NativeStorage.remove("authToken");
            await NativeStorage.remove("userData");
            dispatch(logout());
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            dispatch(logout());
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }
);
