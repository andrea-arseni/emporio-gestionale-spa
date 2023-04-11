import { IonActionSheet } from "@ionic/react";
import {
    alertCircleOutline,
    bagAddOutline,
    bagRemoveOutline,
    buildOutline,
    businessOutline,
    calendarNumberOutline,
    calendarOutline,
    cardOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    closeOutline,
    discOutline,
    documentTextOutline,
    folderOpenOutline,
    homeOutline,
    imagesOutline,
    logoEuro,
    mailOutline,
    pencilOutline,
    peopleCircleOutline,
    peopleOutline,
    phonePortraitOutline,
    readerOutline,
    squareOutline,
    statsChartOutline,
    stopOutline,
    textOutline,
    trashBinOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { entitiesType } from "../../../entities/entity";
import { useAppDispatch } from "../../../hooks";

const FilterActionSheet: React.FC<{
    entitiesType: entitiesType;
    setFilter: any;
    setPage: any;
    showFilterActionSheet: boolean;
    setShowFilterActionSheet: Dispatch<SetStateAction<boolean>>;
    setNegativeForbidden: Dispatch<SetStateAction<boolean>>;
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
    public?: boolean;
    localQuery?: boolean;
}> = (props) => {
    const dispatch = useAppDispatch();

    const buttonHandler = async (
        filterMode: "default" | "numberFilter" | "stringFilter" | "dataFilter",
        filter: any,
        negativeForbidden?: boolean
    ) => {
        props.setShowFilterActionSheet(false);
        await new Promise((r) => setTimeout(r, 300));
        props.setFilterMode(filterMode);
        props.localQuery
            ? props.setFilter(filter)
            : dispatch(props.setFilter(filter));
        props.localQuery ? props.setPage(1) : dispatch(props.setPage(1));
        if (negativeForbidden) props.setNegativeForbidden(true);
    };

    const getDataButton = () => {
        return {
            text: "Data",
            icon: calendarOutline,
            handler: () =>
                buttonHandler("dataFilter", {
                    filter: "data",
                }),
        };
    };

    const getTestoButton = () => {
        return {
            text: "Testo",
            icon: documentTextOutline,
            handler: () => {
                buttonHandler("stringFilter", {
                    filter: "descrizione",
                });
            },
        };
    };

    const getButtons = () => {
        let buttons: any[] = [];
        switch (props.entitiesType) {
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
                        text: "Solo Ricavi",
                        icon: bagAddOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "importo",
                                min: 0,
                            });
                        },
                    },
                    {
                        text: "Solo Spese",
                        icon: bagRemoveOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "importo",
                                max: 0,
                            });
                        },
                    },
                    getDataButton(),
                    getTestoButton(),
                ];
                break;
            case "immobili":
                buttons = [
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
                ];
                break;
            case "persone":
                buttons = [
                    getDataButton(),
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
                        text: "Persone Attive",
                        icon: peopleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "a_attiva",
                            });
                        },
                    },
                    {
                        text: "Persone Che Richiamano",
                        icon: alertCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "b_richiama_lei",
                            });
                        },
                    },
                    {
                        text: "Persone Da Aspettare",
                        icon: stopOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "c_aspetta",
                            });
                        },
                    },
                    {
                        text: "Persone Disattive",
                        icon: peopleCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "d_disattiva",
                            });
                        },
                    },
                    {
                        text: "Persone da Evitare",
                        icon: trashBinOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "e_evita",
                            });
                        },
                    },

                    {
                        text: "Provenienza",
                        icon: discOutline,
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
                                filter: "immobili",
                                value: "true",
                            });
                        },
                    },
                    {
                        text: "Solo Inquilini",
                        icon: businessOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "immobileInquilino",
                                value: null,
                            });
                        },
                    },
                ];
                break;
            case "logs":
                buttons = [
                    getDataButton(),
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
                buttons = [getDataButton(), getTestoButton()];
                break;
            case "eventi":
                buttons = [getDataButton(), getTestoButton()];
                break;
            case "lavori":
                buttons = [
                    getDataButton(),
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
                                value: "a_aperto",
                            });
                        },
                    },
                    {
                        text: "Lavori In Pausa",
                        icon: alertCircleOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "b_aspetta",
                            });
                        },
                    },
                    {
                        text: "Lavori Conclusi",
                        icon: trashBinOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "c_concluso",
                            });
                        },
                    },
                    {
                        text: "Lavori Annullati",
                        icon: trashOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "status",
                                value: "d_annullato",
                            });
                        },
                    },
                ];
                break;
            case "documenti":
                buttons = [
                    {
                        text: "Filtra per Nome",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "nome",
                            });
                        },
                    },
                    {
                        text: "Solo PDF",
                        icon: readerOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "tipologia",
                                value: "pdf",
                            });
                        },
                    },
                    {
                        text: "Solo Immagini",
                        icon: imagesOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "tipologia",
                                value: "jpeg",
                            });
                        },
                    },
                    {
                        text: "Solo Word",
                        icon: pencilOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "tipologia",
                                value: "doc",
                            });
                        },
                    },
                    {
                        text: "Solo Excel",
                        icon: statsChartOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "tipologia",
                                value: "csv",
                            });
                        },
                    },
                    {
                        text: "Solo TXT",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("default", {
                                filter: "tipologia",
                                value: "txt",
                            });
                        },
                    },
                ];
                break;
            case "visite":
                buttons = [
                    {
                        text: "Filtra per Data",
                        icon: calendarOutline,
                        handler: () => {
                            buttonHandler("dataFilter", {
                                filter: "quando",
                            });
                        },
                    },
                    {
                        text: "Filtra per Note",
                        icon: textOutline,
                        handler: () => {
                            buttonHandler("stringFilter", {
                                filter: "note",
                            });
                        },
                    },
                ];
        }

        buttons!.push({
            text: "Annulla",
            icon: closeOutline,
            role: "cancel",
        });

        if (!props.public && props.entitiesType === "immobili") {
            buttons.unshift({
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
            });
            buttons.push({
                text: "Attivi",
                icon: checkmarkCircleOutline,
                handler: () => {
                    buttonHandler("default", {
                        filter: "status",
                        value: "attivo",
                    });
                },
            });
            buttons.push({
                text: "Disattivi",
                icon: closeCircleOutline,
                handler: () => {
                    buttonHandler("default", {
                        filter: "status",
                        value: "disattivo",
                    });
                },
            });
        }

        if (props.entitiesType === "immobili")
            buttons.unshift({
                text: "Titolo",
                icon: textOutline,
                handler: () => {
                    buttonHandler("stringFilter", {
                        filter: "titolo",
                    });
                },
            });

        return buttons;
    };

    return (
        <IonActionSheet
            isOpen={props.showFilterActionSheet}
            header="Filtra per:"
            buttons={getButtons()}
        />
    );
};

export default FilterActionSheet;
