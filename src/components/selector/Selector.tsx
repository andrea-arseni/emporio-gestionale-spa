import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    useIonAlert,
} from "@ionic/react";
import { filterOutline, layersOutline, listOutline } from "ionicons/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { entitiesType, Entity } from "../../entities/entity";
import { Filtro } from "../../entities/filtro.model";
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

const Selector: React.FC<{
    entitiesType: entitiesType;
    filter: Filtro;
    setFilter: Dispatch<SetStateAction<Filtro>>;
    sort: string;
    setSort: Dispatch<SetStateAction<string>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?: Dispatch<SetStateAction<"list" | "form">>;
    baseUrl?: string;
    selectMode?: boolean;
}> = (props) => {
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

    const history = useHistory();

    const [update, setUpdate] = useState<number>(0);

    const ionListRef = useRef<any>();

    const closeItems = () => ionListRef.current.closeSlidingItems();

    // definisci quale tipologia di entity vuoi cercare
    useEffect(() => {
        const getFilter = () => {
            let res = `&filter=${props.filter.filter}`;
            if (props.filter.startDate)
                res = `${res}&startDate=${props.filter.startDate}`;
            if (props.filter.endDate)
                res = `${res}&endDate=${getDateAsString(
                    addDays(new Date(props.filter.endDate), 1)
                )}`;
            if (props.filter.min || props.filter.min === 0)
                res = `${res}&min=${props.filter.min}`;
            if (props.filter.max || props.filter.max === 0)
                res = `${res}&max=${props.filter.max}`;
            if (props.filter.value) res = `${res}&value=${props.filter.value}`;
            return res;
        };

        const fetchEntities = async () => {
            try {
                setShowLoading(true);
                const url = `${
                    props.baseUrl ? props.baseUrl : props.entitiesType
                }?page=${props.page}${
                    props.filter.filter ? getFilter() : ""
                }&sort=${props.sort}`;
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
        props.page,
        props.entitiesType,
        props.filter,
        props.sort,
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
                props.setFilter({ filter: undefined });
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
                        closeItems={closeItems}
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
                    />
                );
            case "documenti":
                return (
                    <ListDocumenti
                        documenti={entities as Documento[]}
                        setMode={props.setMode!}
                        setCurrentEntity={props.setCurrentEntity!}
                        deleteEntity={deleteEntity}
                        showLoading={showLoading}
                        setShowLoading={setShowLoading}
                        setUpdate={setUpdate}
                    />
                );
        }
    };

    const getListHeight = () => {
        if (props.entitiesType === "steps" || props.entitiesType === "eventi")
            return styles.high;
        return styles.fullOption;
    };

    if (filterMode === "dataFilter")
        return (
            <>
                {filterBar}
                <DateFilter
                    filter={props.filter}
                    setFilter={props.setFilter}
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
                    filter={props.filter}
                    setFilter={props.setFilter}
                    setFilterMode={setFilterMode}
                />
            </>
        );

    if (filterMode === "stringFilter")
        return (
            <>
                {filterBar}
                <StringFilter
                    filter={props.filter}
                    setFilter={props.setFilter}
                    setFilterMode={setFilterMode}
                />
            </>
        );

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {props.filter.filter && (
                <FilterBar
                    entitiesType={props.entitiesType}
                    filter={props.filter}
                    setFilter={props.setFilter}
                    setPage={props.setPage}
                    setNegativeForbidden={setNegativeForbidden}
                />
            )}
            {!props.filter.filter && entities.length > 1 && (
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
                page={props.page}
                setPage={props.setPage}
                numberOfResults={numberOfResults}
            />
            <FilterActionSheet
                showFilterActionSheet={showFilterActionSheet}
                setShowFilterActionSheet={setShowFilterActionSheet}
                setFilterMode={setFilterMode}
                setFilter={props.setFilter}
                setPage={props.setPage}
                setNegativeForbidden={setNegativeForbidden}
                entity={props.entitiesType}
            />
            <SortActionSheet
                showSortingActionSheet={showSortingActionSheet}
                setShowSortingActionSheet={setShowSortingActionSheet}
                setSort={props.setSort}
                setPage={props.setPage}
                entity={props.entitiesType}
            />
        </>
    );
};

export default Selector;
