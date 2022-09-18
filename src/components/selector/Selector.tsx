import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    IonToolbar,
    useIonAlert,
} from "@ionic/react";
import {
    closeOutline,
    filterOutline,
    layersOutline,
    listOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { entitiesType, Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import { Lavoro } from "../../entities/lavoro.model";
import { Log } from "../../entities/log.model";
import { Operazione } from "../../entities/operazione.model";
import { Persona } from "../../entities/persona.model";
import { Step } from "../../entities/step.model";
import useWindowSize from "../../hooks/use-size";
import axiosInstance from "../../utils/axiosInstance";
import capitalize from "../../utils/capitalize";
import errorHandler from "../../utils/errorHandler";
import { numberAsPrice } from "../../utils/numberAsPrice";
import { getStatusText } from "../../utils/statusHandler";
import { addDays, getDateAsString, getDayName } from "../../utils/timeUtils";
import Card from "../card/Card";
import FilterActionSheet from "../filter-action-sheet/FilterActionSheet";
import DateFilter from "../filters/date-filter/DateFilter";
import NumberFilter from "../filters/number-filter/NumberFilter";
import StringFilter from "../filters/string-filter/StringFilter";
import ListImmobili from "../lists/ListImmobili";
import ListLavori from "../lists/ListLavori";
import ListLogs from "../lists/ListLogs";
import ListOperazioni from "../lists/ListOperazioni";
import ListPersone from "../lists/ListPersone";
import ListSteps from "../lists/ListSteps";
import PageFooter from "../page-footer/PageFooter";
import SortActionSheet from "../sort-action-sheet/SortActionSheet";
import Title from "../title/Title";
import styles from "./Selector.module.css";

const Selector: React.FC<{
    baseUrl?: string;
    entitiesType: entitiesType;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?: Dispatch<SetStateAction<"list" | "form">>;
    static?: boolean;
}> = (props) => {
    const [width] = useWindowSize();

    const getInitialSorting = () => {
        switch (props.entitiesType) {
            case "operazioni":
                return "data";
            case "lavori":
                return "status";
            case "immobili":
                return "ref";
            case "persone":
                return "status";
            default:
                return "";
        }
    };

    const [filterMode, setFilterMode] = useState<
        "default" | "stringFilter" | "dataFilter" | "numberFilter"
    >("default");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [showFilterActionSheet, setShowFilterActionSheet] =
        useState<boolean>(false);

    const [showSortingActionSheet, setShowSortingActionSheet] =
        useState<boolean>(false);

    const [entities, setEntities] = useState<Entity[]>([]);

    const [page, setPage] = useState<number>(1);

    const [numberOfResults, setNumberOfResults] = useState<number>(0);

    const [sort, setSort] = useState<string>(getInitialSorting());

    const [negativeForbidden, setNegativeForbidden] = useState<boolean>(false);

    const [filter, setFilter] = useState<{
        filter: string | undefined;
        value?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>({
        filter: undefined,
    });

    const [presentAlert] = useIonAlert();

    const history = useHistory();

    const [update, setUpdate] = useState<number>(0);

    const ionListRef = useRef<any>();

    const closeItems = () => ionListRef.current.closeSlidingItems();

    // definisci quale tipologia di entity vuoi cercare
    useEffect(() => {
        const getFilter = () => {
            let res = `&filter=${filter.filter}`;
            if (filter.startDate) res = `${res}&startDate=${filter.startDate}`;
            if (filter.endDate)
                res = `${res}&endDate=${getDateAsString(
                    addDays(new Date(filter.endDate), 1)
                )}`;
            if (filter.min || filter.min === 0)
                res = `${res}&min=${filter.min}`;
            if (filter.max || filter.max === 0)
                res = `${res}&max=${filter.max}`;
            if (filter.value) res = `${res}&value=${filter.value}`;
            return res;
        };

        const fetchEntities = async () => {
            try {
                setShowLoading(true);
                const url = `${
                    props.baseUrl ? props.baseUrl : props.entitiesType
                }?page=${page}${filter.filter ? getFilter() : ""}&sort=${sort}`;
                const res = await axiosInstance.get(url);
                await new Promise((r) => setTimeout(r, 300));
                setShowLoading(false);
                setEntities(res.data.data);
                setNumberOfResults(res.data.numberOfResults);
            } catch (e: any) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => history.goBack(),
                    `Impossibile visualizzare ${props.entitiesType}`,
                    presentAlert
                );
            }
        };

        fetchEntities();
    }, [
        history,
        presentAlert,
        page,
        props.entitiesType,
        filter,
        sort,
        update,
        props.baseUrl,
    ]);

    const filterBar = (
        <IonButton
            className={styles.filterButton}
            expand="full"
            mode="ios"
            fill="outline"
            color="dark"
            onClick={() => {
                setFilterMode("default");
                setFilter({ filter: undefined });
            }}
        >
            <IonIcon icon={listOutline} />
            <IonLabel style={{ paddingLeft: "16px" }}>
                Torna alla Lista
            </IonLabel>
        </IonButton>
    );

    const confirmDeleteEntity = async (entityName: string, id: string) => {
        const url = (props.baseUrl ? props.baseUrl : entityName) + "/" + id;
        try {
            setShowLoading(true);
            await axiosInstance.delete(url);
            setEntities((prevEntities) =>
                prevEntities.filter((el) => el.id?.toString() !== id)
            );
            setShowLoading(false);
            setUpdate((oldNumber) => ++oldNumber);
        } catch (e) {
            setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Eliminazione non riuscita",
                presentAlert
            );
        }
    };

    const deleteEntity = (entityName: string, id: string, message?: string) => {
        presentAlert({
            header: "Attenzione!",
            subHeader: message ? message : "La cancellazione è irreversibile.",
            buttons: [
                {
                    text: "Conferma",
                    handler: () => confirmDeleteEntity(entityName, id),
                },
                {
                    text: "Indietro",
                    handler: () => closeItems(),
                },
            ],
        });
    };

    const getEntities = () => {
        switch (props.entitiesType) {
            case "immobili":
                return (
                    <ListImmobili
                        immobili={entities as Immobile[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                        closeItems={closeItems}
                    />
                );
            case "operazioni":
                return (
                    <ListOperazioni
                        operazioni={entities as Operazione[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                    />
                );
            case "logs":
                return <ListLogs logs={entities as Log[]} />;
            case "lavori":
                return (
                    <ListLavori
                        lavori={entities as Lavoro[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                    />
                );
            case "steps":
                return (
                    <ListSteps
                        steps={entities as Step[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                    />
                );
            case "persone":
                return (
                    <ListPersone
                        persone={entities as Persona[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                        closeItems={closeItems}
                    />
                );
        }
    };

    const getFilterTitle = () => {
        let output = "Risultati ";
        if (filter.startDate || filter.endDate) {
            if (filter.startDate)
                output =
                    output + `dal ${getDayName(new Date(filter.startDate))}`;
            if (!filter.endDate) output = output + " in poi";
            if (filter.endDate)
                output =
                    output + ` fino al ${getDayName(new Date(filter.endDate))}`;
            return output;
        }
        if (filter.min || filter.max) {
            output = output + `con ${capitalize(filter.filter!)} `;
            if (filter.min)
                output =
                    output +
                    `da ${
                        filter.filter === "prezzo"
                            ? numberAsPrice(filter.min)
                            : filter.min
                    } `;
            if (filter.max)
                output =
                    output +
                    `fino a ${
                        filter.filter === "prezzo"
                            ? numberAsPrice(filter.max)
                            : filter.max
                    }`;
            return output;
        }
        if (filter.filter === "status")
            return `${capitalize(
                props.entitiesType
            )} con status: "${getStatusText(filter.value!)}"`;

        if (filter.filter === "isProprietario") return "Lista Proprietari";

        if (filter.filter === "isInquilino") return "Lista Inquilini";

        output =
            output + `con "${filter.value}" in ${capitalize(filter.filter!)}`;
        return output;
    };

    const getListHeight = () => {
        if (props.entitiesType === "steps") return styles.heightSteps;
        if (props.static) return styles.simple;
        return styles.fullOption;
    };

    if (filterMode === "dataFilter")
        return (
            <>
                {filterBar}
                <DateFilter
                    filter={filter}
                    setFilter={setFilter}
                    setFilterMode={setFilterMode}
                />
            </>
        );

    if (filterMode === "numberFilter")
        return (
            <>
                {filterBar}
                <NumberFilter
                    negativeForbidden={negativeForbidden}
                    filter={filter}
                    setFilter={setFilter}
                    setFilterMode={setFilterMode}
                />
            </>
        );

    if (filterMode === "stringFilter")
        return (
            <>
                {filterBar}
                <StringFilter
                    filter={filter}
                    setFilter={setFilter}
                    setFilterMode={setFilterMode}
                />
            </>
        );

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {!props.static && filter.filter && (
                <IonToolbar className={styles.filterToolbar} mode="ios">
                    <Title>{getFilterTitle()}</Title>

                    <IonButton
                        slot="end"
                        size="small"
                        color="dark"
                        mode="ios"
                        onClick={() => {
                            setFilter({
                                filter: undefined,
                                value: undefined,
                                startDate: undefined,
                                endDate: undefined,
                                max: undefined,
                                min: undefined,
                            });
                            setPage(1);
                            setNegativeForbidden(false);
                        }}
                    >
                        <IonIcon icon={closeOutline} color="light"></IonIcon>
                        {width >= 450 ? "Annulla Filtro" : ""}
                    </IonButton>
                </IonToolbar>
            )}
            {!props.static && !filter.filter && entities.length > 1 && (
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="ios"
                    fill="outline"
                    onClick={() => setShowFilterActionSheet(true)}
                >
                    <IonIcon icon={filterOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Filtra la Lista
                    </IonLabel>
                </IonButton>
            )}
            {!props.static && entities.length > 1 && (
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="ios"
                    fill="outline"
                    color="dark"
                    onClick={() => setShowSortingActionSheet(true)}
                >
                    <IonIcon icon={layersOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Ordina risultati
                    </IonLabel>
                </IonButton>
            )}
            {entities.length > 0 && (
                <IonList
                    ref={ionListRef}
                    className={`${styles.list} ${getListHeight()}`}
                >
                    {getEntities()}
                </IonList>
            )}
            {entities.length === 0 && !showLoading && (
                <div className={`${getListHeight()} centered`}>
                    <Card
                        subTitle={`Non sono presenti ${props.entitiesType}`}
                        title={
                            "Non sono stati trovati risultati per la ricerca effettuata"
                        }
                        phone={null}
                        email={null}
                    />
                </div>
            )}
            <PageFooter
                page={page}
                setPage={setPage}
                numberOfResults={numberOfResults}
            />
            <FilterActionSheet
                showFilterActionSheet={showFilterActionSheet}
                setShowFilterActionSheet={setShowFilterActionSheet}
                setFilterMode={setFilterMode}
                setFilter={setFilter}
                setPage={setPage}
                setNegativeForbidden={setNegativeForbidden}
                entity={props.entitiesType}
            />
            <SortActionSheet
                showSortingActionSheet={showSortingActionSheet}
                setShowSortingActionSheet={setShowSortingActionSheet}
                setSort={setSort}
                setPage={setPage}
                entity={props.entitiesType}
            />
        </>
    );
};

export default Selector;
