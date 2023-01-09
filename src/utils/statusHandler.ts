export const getLavoroTitleColor = (input: string) => {
    input = input.toLowerCase();
    switch (input) {
        case "a_aperto":
            return "secondary";
        case "b_aspetta":
            return "warning";
        case "c_concluso":
            return "dark";
        case "d_annullato":
            return "danger";
        default:
            return "";
    }
};

export const getPersonaNameColor = (input: string) => {
    input = input.toLowerCase();
    switch (input) {
        case "a_attiva":
            return "light";
        case "d_disattiva":
            return "dark";
        case "b_richiama_lei":
            return "secondary";
        case "e_evita":
            return "danger";
        case "c_aspetta":
            return "warning";
        default:
            return "";
    }
};

export const getStatusText = (input: string) => {
    if (!input.includes("_")) return input;
    return input.toLowerCase().split("_")[1];
};
