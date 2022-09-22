export type personaType =
    | "ATTIVA"
    | "RIPOSO"
    | "RICHIAMA_LEI"
    | "NON_RICHIAMARE"
    | "ASPETTA";

export const possibiliPersoneTypes = [
    { value: "ATTIVA", text: "Da Sentire" },
    { value: "RIPOSO", text: "Disattiva" },
    { value: "RICHIAMA_LEI", text: "Richiama Lei" },
    { value: "NON_RICHIAMARE", text: "Da Non Richiamare" },
    { value: "ASPETTA", text: "Da Aspettare" },
];
