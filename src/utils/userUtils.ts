export const isUserAdmin = () => {
    const role = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")!).role
        : null;
    return role && role === "ADMIN";
};
