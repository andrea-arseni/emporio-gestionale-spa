import { NativeStorage } from "@awesome-cordova-plugins/native-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isNativeApp } from "../utils/contactUtils";
import { login, logout, loginData } from "./auth-slice";

export const performAutoLogin = createAsyncThunk(
    "autoLogin",
    async (_, { dispatch }) => {
        if (isNativeApp) {
            const token = await NativeStorage.getItem("authToken");
            const userDataStringified = await NativeStorage.getItem("userData");
            const userData = userDataStringified
                ? JSON.parse(userDataStringified)
                : null;
            const loginData: loginData = {
                token: token ? token : null,
                userData: userData ? userData : null,
            };

            const keys = Object.keys(NativeStorage);

            keys.forEach((key) => {
                if (key.startsWith("immobile")) {
                    NativeStorage.remove(key);
                }
            });

            dispatch(login(loginData));
        } else {
            const token = localStorage.getItem("authToken");
            const userData = localStorage.getItem("userData")
                ? JSON.parse(localStorage.getItem("userData")!)
                : null;
            const loginData: loginData = {
                token,
                userData,
            };

            const keys = Object.keys(localStorage);

            keys.forEach((key) => {
                if (key.startsWith("immobile")) {
                    delete localStorage[key];
                }
            });

            dispatch(login(loginData));
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
            localStorage.setItem("authToken", loginData.token!);
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
            window.location.replace("/");
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            dispatch(logout());
            await new Promise((r) => setTimeout(r, 5200));
            window.location.replace("/");
        }
    }
);
