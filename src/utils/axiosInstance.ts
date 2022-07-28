import axios from "axios";
import store from "../store/index";

const axiosInstance = axios.create({
    baseURL: "https://arsecasa.link/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        const token = store.getState()?.auth?.authToken;
        if (token) config.headers["Authorization"] = `Bearer: ${token}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export default axiosInstance;
