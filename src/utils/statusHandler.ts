export const getLavoroTitleColor = (input: string) => {
    input = input.toLowerCase();
    switch (input) {
        case "a_aperto":
            return "light";
        case "b_aspetta":
            return "tertiary";
        case "c_concluso":
            return "primary";
        case "d_annullato":
            return "dark";
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
            return "tertiary";
        default:
            return "";
    }
};

export const getStatusText = (input: string) => {
    if (!input.includes("_")) return input;
    return input.toLowerCase().split("_")[1];
};
