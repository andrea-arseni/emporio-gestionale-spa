import { userData } from "../store/auth-slice";

export const isUserAdmin = (userData: userData | null) =>
    userData && userData.role && userData.role === "ADMIN";
