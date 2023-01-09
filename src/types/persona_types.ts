export type personaType =
    | "A_ATTIVA"
    | "D_DISATTIVA"
    | "B_RICHIAMA_LEI"
    | "E_EVITA"
    | "C_ASPETTA";

export const possibiliPersoneTypes = [
    { value: "A_ATTIVA", text: "Attiva" },
    { value: "B_RICHIAMA_LEI", text: "Richiama Lei" },
    { value: "C_ASPETTA", text: "Aspetta" },
    { value: "D_DISATTIVA", text: "Disattiva" },
    { value: "E_EVITA", text: "Evita" },
];
