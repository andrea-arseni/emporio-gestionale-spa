export const getLavoroTitleColor = (input: string) => {
    input = input.toLowerCase().replace("_", " ");
    switch (input) {
        case "in corso":
            return "light";
        case "aspetta":
            return "warning";
        case "aperto":
            return "secondary";
        case "concluso":
            return "dark";
        case "annullato":
            return "danger";
        default:
            return "";
    }
};

export const getPersonaNameColor = (input: string) => {
    input = input.toLowerCase().replace("_", " ");
    switch (input) {
        case "attiva":
            return "light";
        case "riposo":
            return "dark";
        case "richiama lei":
            return "secondary";
        case "non richiamare":
            return "danger";
        case "aspetta":
            return "warning";
        default:
            return "";
    }
};

export const getStatusText = (input: string) => {
    input = input.replace("_", " ").toUpperCase();
    switch (input) {
        case "ATTIVA":
            return "Da Sentire";
        case "ASPETTA":
            return "Da Aspettare";
        case "RICHIAMA LEI":
            return "Richiamano Loro";
        case "RIPOSO":
            return "Disattive";
        case "NON RICHIAMARE":
            return "Da Non Richiamare";
        default:
            return input;
    }
};
