import { Immobile } from "../entities/immobile.model";
import { FeatureField } from "../pages/immobili/Immobile/Immobile";
import { correctZona, stringifyNumber } from "./stringUtils";

type caratteristiche = {
    principali: FeatureField[];
    efficienzaEnergetica: FeatureField[];
    costruzione: FeatureField[];
    specifiche: FeatureField[];
    pertinenze: FeatureField[];
    impianti: FeatureField[];
    serramenti: FeatureField[];
    spese: FeatureField[];
    locazione: FeatureField[];
};

export const addLocali = (house: Immobile) => {
    const tipologia = house!.tipologia?.toLowerCase();
    return !tipologia ||
        tipologia === "box" ||
        tipologia === "camera singola" ||
        tipologia === "loft" ||
        tipologia === "posto auto" ||
        tipologia === "posto letto in camera condivisa" ||
        tipologia === "uffici open space"
        ? ""
        : ` di ${house!.locali} local${house!.locali === "1" ? "e" : "i"}`;
};

export const isSpecified = (valore: string | null) =>
    valore &&
    valore.toLowerCase() !== "undefined" &&
    valore.toLowerCase() !== "null";

export const displayNonSpecificatoSeAssente = (valore: any) =>
    isSpecified(valore) ? valore : "Non specificato";

export const getCaratteristicheDefault = () => {
    let caratteristiche: caratteristiche = {
        principali: [],
        efficienzaEnergetica: [],
        costruzione: [],
        specifiche: [],
        pertinenze: [],
        impianti: [],
        serramenti: [],
        spese: [],
        locazione: [],
    };
    return caratteristiche;
};

export const popolaCaratteristiche = (
    house: Immobile,
    caratteristiche: caratteristiche
) => {
    if (house) {
        if (isSpecified(house.categoria) && isSpecified(house.contratto)) {
            caratteristiche.principali.push({
                value: `${
                    house.contratto!.charAt(0).toUpperCase() +
                    house.contratto!.substring(1)
                } di immobile ${house.categoria}`,
                label: "Categoria",
            });
        }
        const tipologia = house.tipologia;
        if (
            tipologia &&
            tipologia !== "box" &&
            tipologia !== "camera singola" &&
            tipologia !== "loft" &&
            tipologia !== "posto auto" &&
            tipologia !== "posto letto in camera condivisa" &&
            tipologia !== "uffici open space"
        ) {
            caratteristiche.principali.push({
                value: `${house.locali}`,
                label: "Locali",
            });
        }
        if (isSpecified(house.stato)) {
            caratteristiche.principali.push({
                value: `${house.stato} ${
                    house.libero ? `(Libero ${house.libero.toLowerCase()})` : ""
                }`,
                label: "Stato dell'immobile",
            });
        }
        if (isSpecified(house.indirizzo)) {
            caratteristiche.principali.push({
                value: `${house.indirizzo}`,
                label: "Indirizzo",
            });
        }
        if (isSpecified(house.comune)) {
            caratteristiche.principali.push({
                value: `${house.comune} ${
                    house.zona ? `(${correctZona(house.zona)})` : ""
                }`,
                label: "Comune",
            });
        }
    }

    if (house && house.caratteristiche) {
        caratteristiche.efficienzaEnergetica = [
            {
                value: `${
                    house.classeEnergetica?.toString().trim().toUpperCase() ===
                    "ESENTE"
                        ? "Esente"
                        : house.classeEnergetica?.toString().trim()
                }${
                    house.classeEnergetica?.toString().trim().toUpperCase() !==
                    "ESENTE"
                        ? ` ${
                              house.consumo! <= 175 ? house.consumo : `> 175`
                          } kWh/m² anno`
                        : ""
                }`,
                label: "Classe energetica",
            },
            {
                value: `${house.riscaldamento} ${
                    house.caratteristiche.combustibile
                        ? `(Combustibile ${house.caratteristiche.combustibile.toLowerCase()})`
                        : ""
                }`,
                label: "Riscaldamento",
            },
        ];
        if (
            house.riscaldamento &&
            house.riscaldamento.trim().toLowerCase() === "autonomo"
        ) {
            caratteristiche.efficienzaEnergetica.push({
                value: house.caratteristiche.speseRiscaldamento + " €/mese",
                label: "Spese riscaldamento",
            });
        }
        if (isSpecified(house.caratteristiche.ariaCondizionata)) {
            caratteristiche.efficienzaEnergetica.push({
                value: house.caratteristiche.ariaCondizionata!,
                label: "Aria condizionata",
            });
        }

        if (house.caratteristiche.annoCostruzione) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.annoCostruzione.toString(),
                label: "Anno di costruzione dell'immobile",
            });
        }

        if (isSpecified(house.caratteristiche.cablato)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.cablato!,
                label: "Cablato",
            });
        }

        if (isSpecified(house.caratteristiche.citofono)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.citofono!,
                label: "Citofono",
            });
        }

        if (isSpecified(house.caratteristiche.portineria)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.portineria!,
                label: "Portineria",
            });
        }

        caratteristiche.costruzione.push({
            value: house.caratteristiche.ascensore
                ? "Presente"
                : "Non presente",
            label: "Ascensore",
        });

        if (isSpecified(house.piano)) {
            caratteristiche.specifiche.push({
                value: `${house.piano} (${
                    house.caratteristiche.ascensore ? `Con` : "Senza"
                } ascensore)`,
                label: "Piano",
            });
        }

        if (isSpecified(house.caratteristiche.esposizione)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.esposizione!,
                label: "Esposizione",
            });
        }

        if (isSpecified(house.caratteristiche.balconi)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.balconi!,
                label: "Balconi",
            });
        }

        if (isSpecified(house.caratteristiche.terrazzi)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.terrazzi!,
                label: "Terrazzi",
            });
        }

        if (isSpecified(house.caratteristiche.antifurto)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.antifurto!,
                label: "Antifurto",
            });
        }

        if (isSpecified(house.caratteristiche.altezza)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.altezza + " metri",
                label: "Altezza",
            });
        }

        if (isSpecified(house.caratteristiche.arredamento)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.arredamento!,
                label: "Arredamento",
            });
        }

        if (isSpecified(house.caratteristiche.mansarda)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.mansarda!,
                label: "Mansarda",
            });
        }

        if (isSpecified(house.caratteristiche.taverna)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.taverna!,
                label: "Taverna",
            });
        }

        caratteristiche.specifiche.unshift({
            value: house.caratteristiche.portaBlindata
                ? "Blindata"
                : "Non blindata",
            label: "Porta d'ingresso",
        });

        if (
            house.caratteristiche.livelli &&
            house.caratteristiche.livelli > 1
        ) {
            caratteristiche.specifiche.unshift({
                value: `L'immobile si distribuisce su ${house.caratteristiche.livelli} livelli`,
                label: "Livelli",
            });
        }

        if (isSpecified(house.caratteristiche.proprieta)) {
            caratteristiche.specifiche.unshift({
                value: house.caratteristiche.proprieta!,
                label: "Proprietà",
            });
        }

        caratteristiche.pertinenze = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.box
                ),
                label: "Box",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.cantina
                ),
                label: "Cantina",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.giardino
                ),
                label: "Giardino",
            },
        ];
        caratteristiche.serramenti = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.serramentiInterni
                ),
                label: "Serramenti interni",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.serramentiEsterni
                ),
                label: "Serramenti esterni",
            },
        ];
        caratteristiche.impianti = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.impiantoElettrico
                ),
                label: "Impianto elettrico",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.impiantoIdraulico
                ),
                label: "Impianto idraulico",
            },
        ];
        caratteristiche.spese = [
            {
                value: house.caratteristiche.speseCondominiali
                    ? `${house.caratteristiche.speseCondominiali} € al mese circa`
                    : "Non sono previste spese di gestione",
                label: "Spese condominiali",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.speseExtraNote
                ),
                label: "Spese extra",
            },
        ];

        if (
            house.caratteristiche.categoriaCatastale &&
            house.caratteristiche.rendita
        ) {
            caratteristiche.spese.unshift({
                value: `${
                    house.caratteristiche.categoriaCatastale
                } (${stringifyNumber(house.caratteristiche.rendita)} €/anno)`,
                label: "Categoria catastale e rendita catastale",
            });
        }

        caratteristiche.locazione = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.cauzione
                ),
                label: "Cauzione necessaria all'ingresso",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.tipoContratto
                ),
                label: "Tipo contratto",
            },
        ];
    }
    return caratteristiche;
};
