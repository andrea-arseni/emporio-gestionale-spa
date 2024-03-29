import axios from "axios";
import store from "../store/index";

const axiosSecondaryApi = axios.create({
    baseURL: "https://gprnjt559c.execute-api.eu-central-1.amazonaws.com/Prod/",
});

axiosSecondaryApi.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        const token = store.getState()?.auth?.authToken;
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export default axiosSecondaryApi;
