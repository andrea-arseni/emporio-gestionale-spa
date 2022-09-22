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

const SortActionSheet: React.FC<{
    showSortingActionSheet: boolean;
    setShowSortingActionSheet: Dispatch<SetStateAction<boolean>>;
    setSort: Dispatch<SetStateAction<string>>;
    setPage: Dispatch<SetStateAction<number>>;
    entity: entitiesType;
}> = (props) => {
    const buttonHandler = (sortType: string) => {
        props.setPage(1);
        props.setSort(sortType);
    };

    const getButtons = () => {
        let buttons: any[] = [];
        switch (props.entity) {
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
                    {
                        text: "Dal più vecchio al più recente",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data"),
                    },
                    {
                        text: "Dal più recente al più vecchio",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data-desc"),
                    },
                ];
                break;
            case "logs":
                buttons = [
                    {
                        text: "Dal più vecchio al più recente",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data"),
                    },
                    {
                        text: "Dal più recente al più vecchio",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data-desc"),
                    },
                ];
                break;
            case "steps":
                buttons = [
                    {
                        text: "Dal più vecchio al più recente",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data"),
                    },
                    {
                        text: "Dal più recente al più vecchio",
                        icon: calendarOutline,
                        handler: () => buttonHandler("data-desc"),
                    },
                ];
                break;
            case "immobili":
                buttons = [
                    {
                        text: "Riferimento",
                        icon: calendarNumberOutline,
                        handler: () => buttonHandler("ref"),
                    },
                    {
                        text: "Riferimento Decrescente",
                        icon: calendarNumberOutline,
                        handler: () => buttonHandler("ref-desc"),
                    },
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
            onDidDismiss={() => props.setShowSortingActionSheet(false)}
            header="Ordina per:"
            buttons={getButtons()}
        />
    );
};

export default SortActionSheet;
