import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
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
import errorHandler from "../../utils/errorHandler";
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
import { QueryData } from "../../entities/queryData";
import useList from "../../hooks/use-list";
import { useNavigate } from "react-router-dom";

const Selector: React.FC<{
    entitiesType: entitiesType;
    queryData: QueryData;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?: Dispatch<SetStateAction<"list" | "form">>;
    baseUrl?: string;
    selectMode?: boolean;
}> = (props) => {
    const {
        page,
        setPage,
        filter,
        setFilter,
        sort,
        setSort,
        update,
        setUpdate,
    } = props.queryData;

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

    const [negativeForbidden, setNegativeForbidden] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const navigate = useNavigate();

    const { list, closeItemsList } = useList();

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
                    () => navigate(-1),
                    `Impossibile visualizzare ${props.entitiesType}`,
                    presentAlert
                );
            }
        };

        fetchEntities();
    }, [
        navigate,
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
                    handler: () => closeItemsList(),
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
                        closeItems={closeItemsList}
                        selectMode={!!props.selectMode}
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
                        closeItems={closeItemsList}
                        selectMode={!!props.selectMode}
                    />
                );
            case "eventi":
                return (
                    <ListEventi
                        eventi={entities as Evento[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                        closeItems={closeItemsList}
                    />
                );
            case "documenti":
                return (
                    <ListDocumenti
                        documenti={entities as Documento[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                        baseUrl="/documenti"
                        closeItems={closeItemsList}
                    />
                );
        }
    };

    const getListHeight = () => {
        if (
            props.entitiesType === "steps" ||
            props.entitiesType === "eventi" ||
            props.baseUrl?.includes("files")
        )
            return styles.high;
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
            {filter.filter && (
                <FilterBar
                    entitiesType={props.entitiesType}
                    filter={filter}
                    setFilter={setFilter}
                    setPage={setPage}
                    setNegativeForbidden={setNegativeForbidden}
                />
            )}
            {!filter.filter && entities.length > 1 && (
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
            {entities.length > 1 && (
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
                    ref={list}
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
