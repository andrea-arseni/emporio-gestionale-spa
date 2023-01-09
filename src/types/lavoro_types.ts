export type lavoroType =
    | "A_APERTO"
    | "B_ASPETTA"
    | "C_CONCLUSO"
    | "D_ANNULLATO";

export const possibiliLavoroTypes = [
    { value: "A_APERTO", text: "Aperto" },
    { value: "B_ASPETTA", text: "Aspetta" },
    { value: "C_CONCLUSO", text: "Concluso" },
    { value: "D_ANNULLATO", text: "Annullato" },
];
