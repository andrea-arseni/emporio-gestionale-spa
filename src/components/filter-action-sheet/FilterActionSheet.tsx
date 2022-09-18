import { IonActionSheet } from "@ionic/react";
import {
    alertCircleOutline,
    buildOutline,
    businessOutline,
    calendarNumberOutline,
    calendarOutline,
    cardOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    closeOutline,
    documentTextOutline,
    folderOpenOutline,
    folderOutline,
    homeOutline,
    logoEuro,
    mailOutline,
    peopleCircleOutline,
    peopleOutline,
    phonePortraitOutline,
    squareOutline,
    stopOutline,
    textOutline,
    trashBinOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { entitiesType } from "../../entities/entity";

const FilterActionSheet: React.FC<{
    showFilterActionSheet: boolean;
    setShowFilterActionSheet: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    setNegativeForbidden: Dispatch<SetStateAction<boolean>>;
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
    setFilter: Dispatch<
        SetStateAction<{
            filter: string | undefined;
            value?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
        }>
    >;
    entity: entitiesType;
}> = (props) => {
    const buttonHandler = (
        filterMode: "default" | "numberFilter" | "stringFilter" | "dataFilter",
        filter: any,
        negativeForbidden?: boolean
    ) => {
        props.setPage(1);
        props.setFilterMode(filterMode);
        props.setFilter(filter);
        if (negativeForbidden) props.setNegativeForbidden(true);
    };

    const getButtons = () => {
        let buttons: any[] = [];
        switch (props.entity) {
            case "operazioni":
                buttons = [
                    {
                        text: "Importo",
                        icon: cardOutline,
                        handler: () =>
                            buttonHandler("numberFilter", {
                                filter: "importo",
                            }),
                    },
                    {
                        text: "Data",
                        icon: calendarOutline,
                        handler: () =>
                            buttonHandler("dataFilter", {
                                filter: "data",
                            }),
                    },
                    {
                        text: "Descrizione",
                        icon: documentTextOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "descrizione",
                            });
                        },
                    },
                ];
                break;
            case "immobili":
                buttons = [
                    {
                        text: "Titolo",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "titolo",
                            });
                        },
                    },
                    {
                        text: "Riferimento",
                        icon: calendarNumberOutline,
                        handler: () => {
                            buttonHandler(
                                "numberFilter",
                                {
                                    filter: "ref",
                                },
                                true
                            );
                        },
                    },
                    {
                        text: "Superficie",
                        icon: squareOutline,
                        handler: () => {
                            buttonHandler(
                                "numberFilter",
                                {
                                    filter: "superficie",
                                },
                                true
                            );
                        },
                    },
                    {
                        text: "Indirizzo",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "indirizzo",
                            });
                        },
                    },
                    {
                        text: "Comune",
                        icon: businessOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "comune",
                            });
                        },
                    },
                    {
                        text: "Prezzo",
                        icon: logoEuro,
                        handler: () => {
                            buttonHandler(
                                "numberFilter",
                                {
                                    filter: "prezzo",
                                },
                                true
                            );
                        },
                    },
                    {
                        text: "In Vendita",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "contratto",
                                value: "vendita",
                            });
                        },
                    },
                    {
                        text: "In Affitto",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "contratto",
                                value: "affitto",
                            });
                        },
                    },
                    {
                        text: "Solo Residenziale",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "categoria",
                                value: "residenziale",
                            });
                        },
                    },
                    {
                        text: "Solo Commerciale",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "categoria",
                                value: "commerciale",
                            });
                        },
                    },
                    {
                        text: "Attivi",
                        icon: checkmarkCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "attivo",
                            });
                        },
                    },
                    {
                        text: "Disattivi",
                        icon: closeCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "disattivo",
                            });
                        },
                    },
                ];
                break;
            case "persone":
                buttons = [
                    {
                        text: "Persone Da Sentire",
                        icon: peopleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "attiva",
                            });
                        },
                    },
                    {
                        text: "Persone Da Aspettare",
                        icon: stopOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "aspetta",
                            });
                        },
                    },
                    {
                        text: "Persone che Richiamano Loro",
                        icon: alertCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "richiama_lei",
                            });
                        },
                    },
                    {
                        text: "Persone Disattive",
                        icon: peopleCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "riposo",
                            });
                        },
                    },
                    {
                        text: "Persone da Evitare",
                        icon: trashBinOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "non_richiamare",
                            });
                        },
                    },
                    {
                        text: "Nome",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "nome",
                            });
                        },
                    },
                    {
                        text: "Telefono",
                        icon: phonePortraitOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "telefono",
                            });
                        },
                    },
                    {
                        text: "Email",
                        icon: mailOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "email",
                            });
                        },
                    },
                    {
                        text: "Ruolo",
                        icon: buildOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "ruolo",
                            });
                        },
                    },
                    {
                        text: "Provenienza",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "provenienza",
                            });
                        },
                    },
                    {
                        text: "Solo Proprietari",
                        icon: homeOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "isProprietario",
                                value: "true",
                            });
                        },
                    },
                    {
                        text: "Solo Inquilini",
                        icon: businessOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "isInquilino",
                                value: "true",
                            });
                        },
                    },
                ];
                break;
            case "logs":
                buttons = [
                    {
                        text: "Data",
                        icon: calendarOutline,
                        handler: () =>
                            buttonHandler("dataFilter", {
                                filter: "data",
                            }),
                    },
                    {
                        text: "Testo",
                        icon: documentTextOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "azione",
                            });
                        },
                    },
                ];
                break;
            case "steps":
                buttons = [
                    {
                        text: "Data",
                        icon: calendarOutline,
                        handler: () =>
                            buttonHandler("dataFilter", {
                                filter: "data",
                            }),
                    },
                    {
                        text: "Testo",
                        icon: documentTextOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "descrizione",
                            });
                        },
                    },
                ];
                break;
            case "lavori":
                buttons = [
                    {
                        text: "Filtra per Titolo",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "titolo",
                            });
                        },
                    },
                    {
                        text: "Lavori Aperti",
                        icon: folderOpenOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "aperto",
                            });
                        },
                    },
                    {
                        text: "Lavori In Corso",
                        icon: folderOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "in_corso",
                            });
                        },
                    },
                    {
                        text: "Lavori In Pausa",
                        icon: alertCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "aspetta",
                            });
                        },
                    },
                    {
                        text: "Lavori Annullati",
                        icon: trashOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "annullato",
                            });
                        },
                    },
                    {
                        text: "Lavori Conclusi",
                        icon: trashBinOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "concluso",
                            });
                        },
                    },
                ];
                break;
        }
        buttons!.push({
            text: "Annulla",
            icon: closeOutline,
            role: "cancel",
        });
        return buttons;
    };

    return (
        <IonActionSheet
            isOpen={props.showFilterActionSheet}
            onDidDismiss={() => props.setShowFilterActionSheet(false)}
            header="Filtra per:"
            buttons={getButtons()}
        />
    );
};

export default FilterActionSheet;
