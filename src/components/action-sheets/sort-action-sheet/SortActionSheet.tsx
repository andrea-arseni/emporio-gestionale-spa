import { IonActionSheet } from "@ionic/react";
import {
    calendarNumberOutline,
    calendarOutline,
    cardOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    closeOutline,
    documentsOutline,
    layersOutline,
    logoEuro,
    ribbonOutline,
    squareOutline,
    textOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { entitiesType } from "../../../entities/entity";
import { useAppDispatch } from "../../../hooks";

const SortActionSheet: React.FC<{
    showSortingActionSheet: boolean;
    setShowSortingActionSheet: Dispatch<SetStateAction<boolean>>;
    entitiesType: entitiesType;
    setSorting: any;
    setPaging: any;
    public?: boolean;
    localQuery?: boolean;
}> = (props) => {
    const dispatch = useAppDispatch();

    const buttonHandler = async (sortType: string) => {
        props.setShowSortingActionSheet(false);
        await new Promise((r) => setTimeout(r, 300));
        props.localQuery
            ? props.setSorting(sortType)
            : dispatch(props.setSorting(sortType));
        props.localQuery ? props.setPaging(1) : dispatch(props.setPaging(1));
    };

    const getSortingTemporale = (nameParam?: string) => {
        return [
            {
                text: "Dal più vecchio al più recente",
                icon: calendarOutline,
                handler: () => buttonHandler(nameParam ? nameParam : "data"),
            },
            {
                text: "Dal più recente al più vecchio",
                icon: calendarOutline,
                handler: () =>
                    buttonHandler(`${nameParam ? nameParam : "data"}-desc`),
            },
        ];
    };

    const getButtons = () => {
        let buttons: any[] = [];
        switch (props.entitiesType) {
            case "operazioni":
                buttons = [
                    {
                        text: "Importo Crescente",
                        icon: cardOutline,
                        handler: () => buttonHandler("importo"),
                    },
                    {
                        text: "Importo Decrescente",
                        icon: cardOutline,
                        handler: () => buttonHandler("importo-desc"),
                    },
                    ...getSortingTemporale(),
                ];
                break;
            case "logs":
                buttons = getSortingTemporale();
                break;
            case "steps":
                buttons = getSortingTemporale();
                break;
            case "eventi":
                buttons = getSortingTemporale();
                break;
            case "immobili":
                buttons = [
                    {
                        text: "Superficie",
                        icon: squareOutline,
                        handler: () => buttonHandler("superficie"),
                    },
                    {
                        text: "Superficie Decrescente",
                        icon: squareOutline,
                        handler: () => buttonHandler("superficie-desc"),
                    },
                    {
                        text: "Prezzo",
                        icon: logoEuro,
                        handler: () => buttonHandler("prezzo"),
                    },
                    {
                        text: "Prezzo Decrescente",
                        icon: logoEuro,
                        handler: () => buttonHandler("prezzo-desc"),
                    },
                ];
                break;
            case "lavori":
                buttons = [
                    {
                        text: "Alfabetico Crescente",
                        icon: textOutline,
                        handler: () => buttonHandler("titolo"),
                    },
                    {
                        text: "Alfabetico Decrescente",
                        icon: textOutline,
                        handler: () => buttonHandler("titolo-desc"),
                    },
                    {
                        text: "Status Crescente",
                        icon: ribbonOutline,
                        handler: () => buttonHandler("status"),
                    },
                    {
                        text: "Status Decrescente",
                        icon: ribbonOutline,
                        handler: () => buttonHandler("status-desc"),
                    },
                ];
                break;
            case "persone":
                buttons = [
                    {
                        text: "Alfabetico Crescente",
                        icon: textOutline,
                        handler: () => buttonHandler("nome"),
                    },
                    {
                        text: "Alfabetico Decrescente",
                        icon: textOutline,
                        handler: () => buttonHandler("nome-desc"),
                    },
                    {
                        text: "Status Crescente",
                        icon: ribbonOutline,
                        handler: () => buttonHandler("status"),
                    },
                    {
                        text: "Status Decrescente",
                        icon: ribbonOutline,
                        handler: () => buttonHandler("status-desc"),
                    },
                ];
                break;
            case "documenti":
                buttons = [
                    {
                        text: "Alfabetico Crescente",
                        icon: textOutline,
                        handler: () => buttonHandler("nome"),
                    },
                    {
                        text: "Alfabetico Decrescente",
                        icon: textOutline,
                        handler: () => buttonHandler("nome-desc"),
                    },
                ];
                break;
            case "visite":
                buttons = getSortingTemporale("quando");
        }

        if (props.entitiesType === "immobili" && !props.public) {
            buttons.unshift({
                text: "Riferimento Decrescente",
                icon: calendarNumberOutline,
                handler: () => buttonHandler("ref-desc"),
            });
            buttons.unshift({
                text: "Riferimento",
                icon: calendarNumberOutline,
                handler: () => buttonHandler("ref"),
            });
            buttons = [
                ...buttons,
                {
                    text: "Prima vendita e poi affitto",
                    icon: documentsOutline,
                    handler: () => buttonHandler("contratto-desc"),
                },
                {
                    text: "Prima affitto e poi vendita",
                    icon: documentsOutline,
                    handler: () => buttonHandler("contratto"),
                },
                {
                    text: "Prima residenziali e poi commerciali",
                    icon: layersOutline,
                    handler: () => buttonHandler("categoria-desc"),
                },
                {
                    text: "Prima commerciali e poi residenziali",
                    icon: layersOutline,
                    handler: () => buttonHandler("categoria"),
                },
                {
                    text: "Prima attivi e poi disattivi",
                    icon: checkmarkCircleOutline,
                    handler: () => buttonHandler("status"),
                },
                {
                    text: "Prima disattivi e poi attivi",
                    icon: closeCircleOutline,
                    handler: () => buttonHandler("status-desc"),
                },
            ];
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
            isOpen={props.showSortingActionSheet}
            header="Ordina per:"
            buttons={getButtons()}
        />
    );
};

export default SortActionSheet;
