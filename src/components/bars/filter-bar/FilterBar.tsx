import { IonToolbar, IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { entitiesType } from "../../../entities/entity";
import { Filtro } from "../../../entities/filtro.model";
import { useAppDispatch } from "../../../hooks";
import useWindowSize from "../../../hooks/use-size";
import { numberAsPrice } from "../../../utils/numberUtils";
import { getStatusText } from "../../../utils/statusHandler";
import { capitalize } from "../../../utils/stringUtils";
import { getDayName } from "../../../utils/timeUtils";
import Title from "../../title/Title";
import styles from "./FilterBar.module.css";

const FilterBar: React.FC<{
    entitiesType: entitiesType;
    resetQueryData: any;
    filter: Filtro;
    setNegativeForbidden?: Dispatch<SetStateAction<boolean>>;
    localQuery?: boolean;
}> = (props) => {
    const [width] = useWindowSize();
    const dispatch = useAppDispatch();

    const getFilterTitleWithDates = () => {
        let output = "Risultati ";
        if (props.filter.startDate)
            output =
                output + `dal ${getDayName(new Date(props.filter.startDate))}`;
        if (!props.filter.endDate) output = output + " in poi";
        if (props.filter.endDate)
            output =
                output +
                ` fino al ${getDayName(new Date(props.filter.endDate))}`;
        return output;
    };

    const getFilterTitleWithNumbers = () => {
        if (
            props.filter.filter === "importo" &&
            props.filter.max === 0 &&
            props.filter.min === undefined
        )
            return "Solo Spese";
        if (
            props.filter.filter === "importo" &&
            props.filter.max === undefined &&
            props.filter.min === 0
        )
            return "Solo Ricavi";

        let output = "Risultati ";
        output = output + `con ${capitalize(props.filter.filter!)} `;
        if (props.filter.min !== undefined)
            output =
                output +
                `da ${
                    props.filter.filter === "prezzo"
                        ? numberAsPrice(props.filter.min)
                        : props.filter.min
                } `;
        if (props.filter.max !== undefined)
            output =
                output +
                `fino a ${
                    props.filter.filter === "prezzo"
                        ? numberAsPrice(props.filter.max)
                        : props.filter.max
                }`;
        return output;
    };

    const getFilterTitleWithString = () => {
        let output = "Risultati ";
        output =
            output +
            `con "${props.filter.value}" in ${capitalize(
                props.filter.filter!
            )}`;
        return output;
    };

    const isValueAnExtension = () => {
        const value = props.filter.value?.toLowerCase();
        return (
            value === "docx" ||
            value === "doc" ||
            value === "odt" ||
            value === "txt" ||
            value === "pdf" ||
            value === "xls" ||
            value === "xlsx" ||
            value === "csv" ||
            value === "jpg" ||
            value === "jpeg" ||
            value === "png"
        );
    };

    const getProgrammaFile = () => {
        const value = props.filter.value?.toLowerCase();
        if (value === "docx" || value === "doc" || value === "odt") {
            return "Solo File apribili con Word";
        }
        if (value === "xls" || value === "xlsx" || value === "csv") {
            return "Solo File apribili con Excel";
        }
        if (value === "jpg" || value === "jpeg" || value === "png") {
            return "Solo File immagine";
        }
        if (value === "txt") return "Solo File TXT";
        if (value === "pdf") return "Solo File PDF";
    };

    const getFilterTitle = () => {
        if (props.filter.filter === "status")
            return `${capitalize(
                props.entitiesType
            )} con status: "${getStatusText(props.filter.value!)}"`;

        if (props.filter.filter === "immobili") return "Lista Proprietari";

        if (props.filter.filter === "immobileInquilino")
            return "Lista Inquilini";

        if (props.filter.filter === "tipologia" && isValueAnExtension()) {
            return getProgrammaFile();
        }

        if (props.filter.startDate || props.filter.endDate)
            return getFilterTitleWithDates();
        if (props.filter.min !== undefined || props.filter.max !== undefined)
            return getFilterTitleWithNumbers();
        return getFilterTitleWithString();
    };

    const azzeraFiltro = () => {
        props.setNegativeForbidden!(false);
        props.localQuery
            ? props.resetQueryData()
            : dispatch(props.resetQueryData());
    };

    return (
        <IonToolbar className={styles.filterToolbar} mode="ios">
            <Title>{getFilterTitle()}</Title>

            {props.setNegativeForbidden && (
                <IonButton
                    slot="end"
                    size="small"
                    color="dark"
                    mode="ios"
                    onClick={azzeraFiltro}
                >
                    <IonIcon icon={closeOutline} color="light"></IonIcon>
                    {width >= 450 ? "Annulla Filtro" : ""}
                </IonButton>
            )}
        </IonToolbar>
    );
};

export default FilterBar;
