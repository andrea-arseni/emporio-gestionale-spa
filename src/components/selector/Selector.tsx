import {
    IonActionSheet,
    IonButton,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonLoading,
    IonNote,
    IonText,
    useIonAlert,
} from "@ionic/react";
import {
    calendarOutline,
    cardOutline,
    closeOutline,
    createOutline,
    documentTextOutline,
    filterOutline,
    layersOutline,
    listOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { entitiesType, Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import { Operazione } from "../../entities/operazione.model";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import { numberAsPrice } from "../../utils/numberAsPrice";
import { getDayName } from "../../utils/timeUtils";
import DateFilter from "../filters/date-filter/DateFilter";
import NumberFilter from "../filters/number-filter/NumberFilter";
import StringFilter from "../filters/string-filter/StringFilter";
import NoResults from "../no-results/NoResults";
import PageFooter from "../page-footer/PageFooter";
import styles from "./Selector.module.css";

const Selector: React.FC<{
    entitiesType: entitiesType;
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
}> = (props) => {
    const [filterMode, setFilterMode] = useState<
        "default" | "stringFilter" | "dataFilter" | "numberFilter"
    >("default");

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

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [showFilterActionSheet, setShowFilterActionSheet] =
        useState<boolean>(false);

    const [showSortingActionSheet, setShowSortingActionSheet] =
        useState<boolean>(false);

    const [entities, setEntities] = useState<Entity[]>([]);

    const [page, setPage] = useState<number>(1);

    const [numberOfResults, setNumberOfResults] = useState<number>(0);

    const [sort, setSort] = useState<string>("data");

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
                const url = `${props.entitiesType}?page=${page}${
                    filter.filter ? getFilter() : ""
                }&sort=${sort}`;
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
    }, [history, presentAlert, page, props.entitiesType, filter, sort]);

    const deleteEntity = async (entityName: string, id: string) => {
        try {
            setShowLoading(true);
            await axiosInstance.delete(entityName + "/" + id);
            setEntities((prevEntities) =>
                prevEntities.filter((el) => el.id?.toString() !== id)
            );
            setShowLoading(false);
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

    const getImmobili = (entities: Immobile[]) =>
        entities.map((immobile: Immobile) => (
            <IonItemSliding key={immobile.id!} id={immobile.id?.toString()}>
                <IonItem detail>
                    <IonLabel>
                        <h2>{immobile.titolo}</h2>
                        <p>{`${immobile.indirizzo} (${immobile.comune})`}</p>
                        <p>{numberAsPrice(immobile.prezzo!)}</p>
                    </IonLabel>
                    <IonNote slot="end">{immobile.status}</IonNote>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption color="warning">
                        <div className="itemOption">
                            <IonIcon icon={createOutline} size="large" />
                            <IonText>Modifica</IonText>
                        </div>
                    </IonItemOption>
                    <IonItemOption color="danger">
                        <div className="itemOption">
                            <IonIcon icon={trashOutline} size="large" />
                            <IonText>Elimina</IonText>
                        </div>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        ));

    const getOperazioni = (entities: Operazione[]) => {
        const operazioni = entities.map((operazione: Operazione) => (
            <IonItemSliding key={operazione.id!} id={operazione.id?.toString()}>
                <IonItem detail>
                    <IonLabel
                        color={operazione.importo! > 0 ? "primary" : "danger"}
                    >
                        <h2>{`${operazione.descrizione} ( ${numberAsPrice(
                            operazione.importo!
                        )} )`}</h2>
                        <p>{`${getDayName(
                            new Date(operazione.data!),
                            "long"
                        )}`}</p>
                        <p>{operazione.user?.name}</p>
                    </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption
                        color="warning"
                        onClick={() => {
                            props.setCurrentEntity(operazione);
                            props.setMode("form");
                        }}
                    >
                        <div className="itemOption">
                            <IonIcon icon={createOutline} size="large" />
                            <IonText>Modifica</IonText>
                        </div>
                    </IonItemOption>
                    <IonItemOption
                        color="danger"
                        onClick={() =>
                            deleteEntity(
                                "operazioni",
                                operazione.id!.toString()
                            )
                        }
                    >
                        <div className="itemOption">
                            <IonIcon icon={trashOutline} size="large" />
                            <IonText>Elimina</IonText>
                        </div>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        ));
        const saldo = entities
            .map((el) => el.importo!)
            .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );
        return (
            <>
                {operazioni}
                <IonItem detail color={saldo! > 0 ? "primary" : "danger"}>
                    <IonLabel>
                        <h2>{`Il Saldo complessivo per questa lista è ${numberAsPrice(
                            saldo
                        )}`}</h2>
                    </IonLabel>
                </IonItem>
            </>
        );
    };

    const getEntities = () => {
        switch (props.entitiesType) {
            case "immobili":
                return getImmobili(entities as Immobile[]);
            case "operazioni":
                return getOperazioni(entities as Operazione[]);
        }
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
            <IonButton
                className={styles.filterButton}
                expand="full"
                mode="ios"
                fill="outline"
                onClick={() => {
                    filter.filter
                        ? setFilter({
                              filter: undefined,
                              value: undefined,
                              startDate: undefined,
                              endDate: undefined,
                              max: undefined,
                              min: undefined,
                          })
                        : setShowFilterActionSheet(true);
                }}
            >
                <IonIcon icon={filter.filter ? closeOutline : filterOutline} />
                <IonLabel style={{ paddingLeft: "16px" }}>
                    {filter.filter ? "Visualizza tutti" : "Filtra la Lista"}
                </IonLabel>
            </IonButton>
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
                <IonList className={styles.list}>{getEntities()}</IonList>
            )}
            {entities.length === 0 && <NoResults />}
            <PageFooter
                page={page}
                setPage={setPage}
                numberOfResults={numberOfResults}
            />
            <IonActionSheet
                isOpen={showFilterActionSheet}
                onDidDismiss={() => setShowFilterActionSheet(false)}
                header="Filtra per:"
                buttons={[
                    {
                        text: "Importo",
                        icon: cardOutline,
                        handler: () => {
                            setFilterMode("numberFilter");
                            setFilter({ filter: "importo" });
                        },
                    },
                    {
                        text: "Data",
                        icon: calendarOutline,
                        handler: () => {
                            setFilterMode("dataFilter");
                            setFilter({ filter: "data" });
                        },
                    },
                    {
                        text: "Descrizione",
                        icon: documentTextOutline,
                        handler: () => {
                            setFilter({ filter: "descrizione" });
                            setFilterMode("stringFilter");
                        },
                    },
                    {
                        text: "Annulla",
                        icon: closeOutline,
                        role: "cancel",
                    },
                ]}
            ></IonActionSheet>
            <IonActionSheet
                isOpen={showSortingActionSheet}
                onDidDismiss={() => setShowSortingActionSheet(false)}
                header="Ordina per:"
                buttons={[
                    {
                        text: "Importo Crescente",
                        icon: cardOutline,
                        handler: () => setSort("importo"),
                    },
                    {
                        text: "Importo Decrescente",
                        icon: cardOutline,
                        handler: () => setSort("importo-desc"),
                    },
                    {
                        text: "Data Crescente",
                        icon: calendarOutline,
                        handler: () => setSort("data"),
                    },
                    {
                        text: "Data Decrescente",
                        icon: calendarOutline,
                        handler: () => setSort("data-desc"),
                    },
                    {
                        text: "Annulla",
                        icon: closeOutline,
                        role: "cancel",
                    },
                ]}
            ></IonActionSheet>
        </>
    );
};

export default Selector;
