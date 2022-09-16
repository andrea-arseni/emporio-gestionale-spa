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
