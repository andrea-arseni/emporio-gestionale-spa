type fileSpecialeType = {
    type: "immobile" | "persona";
    fileSpeciale: fileSpeciale;
};

export type fileSpeciale =
    | "planimetria-catastale"
    | "visura-catastale"
    | "atto-provenienza"
    | "consuntivo-spese"
    | "certificazione-energetica"
    | "contratto-collaborazione"
    | "documento-identità";

export const listFileSpeciali: fileSpecialeType[] = [
    { type: "immobile", fileSpeciale: "planimetria-catastale" },
    { type: "immobile", fileSpeciale: "visura-catastale" },
    { type: "immobile", fileSpeciale: "atto-provenienza" },
    { type: "immobile", fileSpeciale: "consuntivo-spese" },
    { type: "immobile", fileSpeciale: "certificazione-energetica" },
    { type: "immobile", fileSpeciale: "contratto-collaborazione" },
    { type: "persona", fileSpeciale: "documento-identità" },
];
