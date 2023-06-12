import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    IonRefresher,
    IonRefresherContent,
    isPlatform,
    RefresherEventDetail,
    useIonAlert,
} from "@ionic/react";
import { filterOutline, layersOutline, listOutline } from "ionicons/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { entitiesType, Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import { Lavoro } from "../../entities/lavoro.model";
import { Log } from "../../entities/log.model";
import { Operazione } from "../../entities/operazione.model";
import { Persona } from "../../entities/persona.model";
import { Step } from "../../entities/step.model";
import axiosInstance from "../../utils/axiosInstance";
import { addDays, getDateAsString } from "../../utils/timeUtils";
import Card from "../card/Card";
import FilterActionSheet from "../action-sheets/filter-action-sheet/FilterActionSheet";
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
import SortActionSheet from "../action-sheets/sort-action-sheet/SortActionSheet";
import styles from "./Selector.module.css";
import ListEventi from "../lists/ListEventi";
import { Evento } from "../../entities/evento.model";
import ListDocumenti from "../lists/ListDocumenti";
import { Documento } from "../../entities/documento.model";
import FilterBar from "../bars/filter-bar/FilterBar";
import useList from "../../hooks/use-list";
import { useNavigate } from "react-router-dom";
import ListVisits from "../lists/ListVisits";
import { Visit } from "../../entities/visit.model";
import { isNativeApp } from "../../utils/contactUtils";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Filtro } from "../../entities/filtro.model";
import { RootState } from "../../store";
import {
    getQueryDataUtils,
    resetQueryDataUtils,
    setFilterUtils,
    setPagingUtils,
    setSortingUtils,
    triggerUpdateUtils,
} from "../../utils/queryUtils";
import useQueryData from "../../hooks/use-query-data";
import useErrorHandler from "../../hooks/use-error-handler";

const Selector: React.FC<{
    entitiesType: entitiesType;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?: Dispatch<SetStateAction<"list" | "form">>;
    baseUrl?: string;
    selectMode?: boolean;
    public?: boolean;
    localQuery?: boolean;
    specific?: boolean;
    backToList?: () => void;
}> = (props) => {
    let { filter, sort, page, update } = useAppSelector((state: RootState) =>
        getQueryDataUtils(state, props.entitiesType)
    );

    let setFilter: any = (filter: Filtro) =>
        setFilterUtils(filter, props.entitiesType);

    let setSort: any = (sort: string) =>
        setSortingUtils(sort, props.entitiesType);

    let setPage: any = (page: number) =>
        setPagingUtils(page, props.entitiesType);

    let setUpdate: any = () => triggerUpdateUtils(props.entitiesType);

    let resetQueryData: any = () => resetQueryDataUtils(props.entitiesType);

    let {
        localFilter,
        localSort,
        localPage,
        localUpdate,
        localSetFilter,
        localSetSort,
        localSetPage,
        localSetUpdate,
        localResetQueryData,
    } = useQueryData(props.entitiesType);

    if (props.localQuery) {
        filter = localFilter;
        sort = localSort;
        page = localPage;
        update = localUpdate;
        setFilter = localSetFilter;
        setSort = localSetSort;
        setPage = localSetPage;
        setUpdate = localSetUpdate;
        resetQueryData = localResetQueryData;
    }

    const dispatch = useAppDispatch();

    const [filterMode, setFilterMode] = useState<
        "default" | "stringFilter" | "dataFilter" | "numberFilter"
    >("default");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [showFilterActionSheet, setShowFilterActionSheet] =
        useState<boolean>(false);

    const [showSortingActionSheet, setShowSortingActionSheet] =
        useState<boolean>(false);

    const [entities, setEntities] = useState<Entity[]>([]);

    const [numberOfResults, setNumberOfResults] = useState<number>(0);

    const [sumOfOperations, setSumOfOperations] = useState<number>(0);

    const [negativeForbidden, setNegativeForbidden] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const navigate = useNavigate();

    const { list, closeItemsList } = useList();

    const { errorHandler } = useErrorHandler();

    // definisci quale tipologia di entity vuoi cercare
    useEffect(() => {
        let mounted = true;

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
                }${
                    props.baseUrl && props.baseUrl.includes("?") ? "&" : "?"
                }page=${page}${filter.filter ? getFilter() : ""}&sort=${sort}`;

                const res = await axiosInstance.get(url);
                if (!mounted) return;
                setShowLoading(false);
                setEntities(props.specific ? [res.data] : res.data.data);
                setNumberOfResults(res.data.numberOfResults);
                if (props.entitiesType === "operazioni")
                    setSumOfOperations(res.data.sum);
            } catch (e: any) {
                if (!mounted) return;
                setShowLoading(false);
                errorHandler(
                    e,
                    `Impossibile visualizzare ${props.entitiesType}`
                );
            }
        };

        if (
            !filter.filter ||
            (filter.filter &&
                (filter.value ||
                    filter.value === "" ||
                    filter.max ||
                    filter.min ||
                    filter.startDate ||
                    filter.endDate))
        )
            fetchEntities();

        return () => {
            mounted = false;
        };
    }, [
        navigate,
        presentAlert,
        errorHandler,
        page,
        props.entitiesType,
        filter,
        sort,
        update,
        props.baseUrl,
        props.specific,
    ]);

    const eraseFilter = () => {
        const filterObj = { filter: undefined };
        setFilterMode("default");
        dispatch(setFilter(filterObj));
    };

    const confirmDeleteEntity = async (entityName: string, id: string) => {
        await new Promise((r) => setTimeout(r, 300));

        let url =
            (props.baseUrl && !props.baseUrl.includes("?")
                ? props.baseUrl
                : entityName) +
            "/" +
            id;
        try {
            setShowLoading(true);

            await axiosInstance.delete(
                props.specific && props.baseUrl ? props.baseUrl : url
            );
            setEntities((prevEntities) =>
                prevEntities.filter((el) => el.id?.toString() !== id)
            );
            setShowLoading(false);
            props.localQuery ? setUpdate(++update) : dispatch(setUpdate());
        } catch (e) {
            setShowLoading(false);
            errorHandler(e, "Eliminazione non riuscita");
        }
    };

    const deleteEntity = (entityName: string, id: string, message?: string) => {
        presentAlert({
            header: "Attenzione!",
            subHeader: message ? message : "La cancellazione è irreversibile.",
            buttons: [
                {
                    text: "Conferma",
                    role: "cancel",
                    handler: () => confirmDeleteEntity(entityName, id),
                },
                {
                    text: "Indietro",
                    handler: () => closeItemsList(),
                },
            ],
        });
    };

    const performUpdate = () => {
        props.localQuery ? setUpdate() : dispatch(setUpdate());
    };

    const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        performUpdate();
        event.detail.complete();
    };

    const getEntities = () => {
        switch (props.entitiesType) {
            case "immobili":
                return (
                    <ListImmobili
                        immobili={entities as Immobile[]}
                        setCurrentEntity={props.setCurrentEntity}
                    />
                );
            case "operazioni":
                return (
                    <ListOperazioni
                        operazioni={entities as Operazione[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        sumOfOperations={sumOfOperations}
                    />
                );
            case "logs":
                return <ListLogs logs={entities as Log[]} />;
            case "lavori":
                return <ListLavori lavori={entities as Lavoro[]} />;
            case "steps":
                return <ListSteps steps={entities as Step[]} />;
            case "persone":
                return (
                    <ListPersone
                        persone={entities as Persona[]}
                        setCurrentEntity={props.setCurrentEntity}
                    />
                );
            case "eventi":
                return <ListEventi eventi={entities as Evento[]} />;
            case "documenti":
                return <ListDocumenti documenti={entities as Documento[]} />;
            case "visite":
                return (
                    <ListVisits
                        displayDay
                        visits={entities as Visit[]}
                        deleteEntity={deleteEntity}
                    />
                );
        }
    };

    const getListHeight: any = () => {
        if (
            props.entitiesType === "logs" ||
            (props.entitiesType === "visite" && props.baseUrl?.includes("?"))
        )
            return isNativeApp && isPlatform("ios")
                ? styles.sixOtherElementsIos
                : styles.sixOtherElements;
        if (props.entitiesType === "eventi") {
            return isNativeApp && isPlatform("ios")
                ? styles.sevenOtherElementsIos
                : styles.sevenOtherElements;
        }
        if (props.entitiesType === "steps")
            return isNativeApp && isPlatform("ios")
                ? styles.stepsListIos
                : styles.stepsList;
        if (props.public)
            return isNativeApp && isPlatform("ios")
                ? styles.publicListIos
                : styles.publicList;
        if (props.selectMode) return styles.fourOtherElements;
        return isNativeApp && isPlatform("ios")
            ? styles.fiveOtherElementsIos
            : styles.fiveOtherElements;
    };

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {filterMode !== "default" && (
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="ios"
                    fill="clear"
                    color="dark"
                    onClick={eraseFilter}
                >
                    <IonIcon icon={listOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Torna alla Lista
                    </IonLabel>
                </IonButton>
            )}
            {filterMode === "stringFilter" && (
                <StringFilter
                    localQuery={props.localQuery}
                    setFilter={setFilter}
                    filter={filter}
                    setFilterMode={setFilterMode}
                />
            )}
            {filterMode === "numberFilter" && (
                <NumberFilter
                    localQuery={props.localQuery}
                    setFilter={setFilter}
                    negativeForbidden={negativeForbidden}
                    filter={filter}
                    setFilterMode={setFilterMode}
                />
            )}
            {filterMode === "dataFilter" && (
                <DateFilter
                    localQuery={props.localQuery}
                    setFilter={setFilter}
                    filter={filter}
                    setFilterMode={setFilterMode}
                />
            )}
            {!props.selectMode && filterMode === "default" && (
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
            )}
            {filter.filter && filterMode === "default" && (
                <FilterBar
                    localQuery={props.localQuery}
                    entitiesType={props.entitiesType}
                    resetQueryData={resetQueryData}
                    filter={filter}
                    setNegativeForbidden={setNegativeForbidden}
                />
            )}
            {!filter.filter &&
                entities.length > 0 &&
                filterMode === "default" && (
                    <IonButton
                        className={styles.filterButton}
                        expand="full"
                        mode="ios"
                        color="primary"
                        fill="clear"
                        disabled={entities.length === 1 || props.specific}
                        onClick={() => setShowFilterActionSheet(true)}
                    >
                        <IonIcon icon={filterOutline} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Filtra la Lista
                        </IonLabel>
                    </IonButton>
                )}
            {entities.length > 0 && filterMode === "default" && (
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="ios"
                    fill="clear"
                    color="dark"
                    disabled={entities.length === 1 || props.specific}
                    onClick={() => setShowSortingActionSheet(true)}
                >
                    <IonIcon icon={layersOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Ordina risultati
                    </IonLabel>
                </IonButton>
            )}
            {entities.length > 0 && filterMode === "default" && (
                <IonList
                    ref={list}
                    className={`${styles.list} ${getListHeight()}`}
                >
                    {getEntities()}
                </IonList>
            )}
            {entities.length === 0 &&
                !showLoading &&
                filterMode === "default" && (
                    <div className={`centered`} style={{ height: "500px" }}>
                        <Card
                            subTitle={`Non sono presenti ${props.entitiesType}`}
                            title={
                                "Non sono stati trovati risultati per la ricerca effettuata"
                            }
                        />
                    </div>
                )}
            {entities.length > 0 && filterMode === "default" && (
                <PageFooter
                    entitiesType={
                        props.localQuery ? undefined : props.entitiesType
                    }
                    setPage={props.localQuery ? setPage : undefined}
                    page={page}
                    numberOfResults={numberOfResults}
                    public={props.public}
                    lifted={
                        props.entitiesType === "eventi" ||
                        props.entitiesType === "logs" ||
                        !!(props.baseUrl && props.baseUrl.includes("?"))
                    }
                />
            )}
            <FilterActionSheet
                localQuery={props.localQuery}
                entitiesType={props.entitiesType}
                setPage={setPage}
                setFilter={setFilter}
                showFilterActionSheet={showFilterActionSheet}
                setShowFilterActionSheet={setShowFilterActionSheet}
                setFilterMode={setFilterMode}
                setNegativeForbidden={setNegativeForbidden}
                public={props.public}
            />
            <SortActionSheet
                localQuery={props.localQuery}
                setSorting={setSort}
                setPaging={setPage}
                showSortingActionSheet={showSortingActionSheet}
                setShowSortingActionSheet={setShowSortingActionSheet}
                entitiesType={props.entitiesType}
                public={props.public}
            />
        </>
    );
};

export default Selector;
