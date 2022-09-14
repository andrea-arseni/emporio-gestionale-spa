import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    IonTitle,
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
import { Log } from "../../entities/log.model";
import { Operazione } from "../../entities/operazione.model";
import axiosInstance from "../../utils/axiosInstance";
import capitalize from "../../utils/capitalize";
import errorHandler from "../../utils/errorHandler";
import { numberAsPrice } from "../../utils/numberAsPrice";
import { getDayName } from "../../utils/timeUtils";
import FilterActionSheet from "../filter-action-sheet/FilterActionSheet";
import DateFilter from "../filters/date-filter/DateFilter";
import NumberFilter from "../filters/number-filter/NumberFilter";
import StringFilter from "../filters/string-filter/StringFilter";
import ListImmobili from "../lists/ListImmobili";
import ListLogs from "../lists/ListLogs";
import ListOperazioni from "../lists/ListOperazioni";
import NoResults from "../no-results/NoResults";
import PageFooter from "../page-footer/PageFooter";
import SortActionSheet from "../sort-action-sheet/SortActionSheet";
import styles from "./Selector.module.css";

const Selector: React.FC<{
    baseUrl?: string;
    entitiesType: entitiesType;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?: Dispatch<SetStateAction<"list" | "form">>;
    static?: boolean;
}> = (props) => {
    const getInitialSorting = () => {
        switch (props.entitiesType) {
            case "operazioni":
                return "data";
            case "immobili":
                return "ref";
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
            if (filter.endDate) res = `${res}&endDate=${filter.endDate}`;
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

    const titleFilter = (
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
        try {
            setShowLoading(true);
            await axiosInstance.delete(entityName + "/" + id);
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
                    role: "cancel",
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
        }
    };

    const getFilterTitle = () => {
        let output = "Risultati ";
        if (filter.startDate || filter.endDate) {
            if (filter.startDate)
                output =
                    output + `dal ${getDayName(new Date(filter.startDate))}`;
            if (filter.endDate)
                output =
                    output + `fino al ${getDayName(new Date(filter.endDate))}`;
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

        output =
            output + `con "${filter.value}" in ${capitalize(filter.filter!)}`;
        return output;
    };

    if (filterMode === "dataFilter")
        return (
            <>
                {titleFilter}
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
                {titleFilter}
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
                {titleFilter}
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
                    <IonTitle>{getFilterTitle()}</IonTitle>
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
                        Annulla Filtro
                    </IonButton>
                </IonToolbar>
            )}
            {!props.static && !filter.filter && (
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
                    className={`${styles.list} ${
                        props.static ? styles.simple : styles.fullOption
                    }`}
                >
                    {getEntities()}
                </IonList>
            )}
            {entities.length === 0 && !showLoading && <NoResults />}
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
