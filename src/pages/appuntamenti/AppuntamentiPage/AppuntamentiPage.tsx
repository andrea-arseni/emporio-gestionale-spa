import {
    IonButton,
    IonIcon,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    isPlatform,
    useIonAlert,
} from "@ionic/react";
import { calendarOutline, listOutline, peopleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import CalendarNavigator from "../../../components/calendar-navigator/CalendarNavigator";
import Calendar from "../../../components/calendar/Calendar";
import DaySelector from "../../../components/day-selector/DaySelector";
import {
    areDateEquals,
    getDateAsString,
    Giorno,
    setWeek,
} from "../../../utils/timeUtils";
import axiosInstance from "../../../utils/axiosInstance";
import { Visit } from "../../../entities/visit.model";
import FormVisit from "../../../components/forms/visit-form/VisitForm";
import errorHandler from "../../../utils/errorHandler";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
    backToList,
    refresh,
    setCurrentVisit,
    setFormActive,
    setPageMode,
} from "../../../store/appuntamenti-slice";
import { changeLoading } from "../../../store/ui-slice";
import ListVisits from "../../../components/lists/ListVisits";
import { isNativeApp } from "../../../utils/contactUtils";
import styles from "./AppuntamentiPage.module.css";
import StringFilter from "../../../components/filters/string-filter/StringFilter";
import useQueryData from "../../../hooks/use-query-data";
import FilterBar from "../../../components/bars/filter-bar/FilterBar";

const AppuntamentiPage: React.FC<{}> = () => {
    const [presentAlert] = useIonAlert();

    const showLoading = useAppSelector((state) => state.ui.isLoading);

    const [currentWeek, setCurrentWeek] = useState<Giorno[]>(
        setWeek(new Date())
    );

    const [currentDay, setCurrentDay] = useState<Date>(
        new Date(
            Date.now() + 1000 * 60 * new Date().getTimezoneOffset()
        ).getDay() === 0
            ? new Date(
                  Date.now() +
                      1000 * 60 * new Date().getTimezoneOffset() -
                      1000 * 60 * 60 * 24
              )
            : new Date(Date.now() + 1000 * 60 * new Date().getTimezoneOffset())
    );

    const [visits, setVisits] = useState<Visit[]>([]);

    const trigger = useAppSelector((state) => state.appuntamenti.trigger);

    const dispatch = useAppDispatch();

    const pageMode = useAppSelector((state) => state.appuntamenti.pageMode);

    const isFormActive = useAppSelector(
        (state) => state.appuntamenti.isFormActive
    );

    const [filterMode, setFilterMode] = useState<
        "default" | "stringFilter" | "dataFilter" | "numberFilter"
    >("default");

    const { filter, setFilter } = useQueryData("visite");

    const openVisitForm = (visit: Visit | null) => {
        dispatch(setCurrentVisit(visit));
        dispatch(setFormActive(true));
    };

    const operationComplete = () => {
        dispatch(refresh());
        dispatch(backToList());
    };

    useEffect(() => {
        const changeDay = (newDay: Date) => {
            // è il giorno nella stessa settimana
            const isDayInTheSameWeek = currentWeek.find((el) =>
                areDateEquals(el.date, newDay)
            );
            // se no cambia la settimana
            if (!isDayInTheSameWeek) {
                const newWeek = setWeek(newDay);
                setCurrentWeek(newWeek);
            }
        };

        changeDay(currentDay);
    }, [currentDay, currentWeek]);

    useEffect(() => {
        let mounted = true;

        const fetchVisits = async () => {
            dispatch(changeLoading(true));
            try {
                let url = `/visite?filter=quando&startDate=${getDateAsString(
                    currentWeek[0].date
                )}&endDate=${getDateAsString(
                    new Date(
                        currentWeek[5].date.getTime() + 1000 * 60 * 60 * 24
                    )
                )}`;
                if (filter.filter && filter.value) {
                    url = `/visite?filter=${filter.filter}&value=${filter.value}`;
                }
                const res = await axiosInstance.get(url);
                if (!mounted) return;
                dispatch(changeLoading(false));
                setVisits(res.data.data);
            } catch (e: any) {
                if (!mounted) return;
                dispatch(changeLoading(false));
                errorHandler(
                    e,
                    () => {},
                    "Visite richieste non disponibili",
                    presentAlert
                );
            }
        };
        if (filter.filter && !filter.value) return;
        fetchVisits();

        return () => {
            mounted = false;
        };
    }, [currentWeek, presentAlert, trigger, dispatch, filter]);

    const todaysVisits = visits
        .filter((visit) => {
            const dataVisita = new Date(visit.quando!);
            return dataVisita.getDate() === currentDay.getDate();
        })
        .sort((a, b) => {
            const firstDate: Date = new Date(a.quando!);
            const secondDate: Date = new Date(b.quando!);
            return firstDate.getTime() - secondDate.getTime();
        });

    const handleFilter = () => {
        if (filter.value) {
            setFilter({ filter: undefined, value: undefined });
        } else {
            setFilter({ filter: "note" });
            setFilterMode("stringFilter");
        }
    };

    if (filterMode === "stringFilter")
        return (
            <>
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="ios"
                    fill="clear"
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
            {pageMode === "calendario" && !isFormActive && (
                <div
                    className={
                        isNativeApp && isPlatform("ios")
                            ? "iosWrapper"
                            : "wrapper"
                    }
                >
                    <DaySelector
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <CalendarNavigator
                        mode="day-week"
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <Calendar
                        visits={visits}
                        currentDay={currentDay}
                        currentWeek={currentWeek}
                        openVisitForm={openVisitForm}
                    />
                </div>
            )}
            {pageMode === "lista" && !isFormActive && (
                <div
                    className={`${
                        isNativeApp && isPlatform("ios")
                            ? "iosWrapper"
                            : "wrapper"
                    } ${styles.page}
                    `}
                >
                    <IonButton
                        size="small"
                        color="medium"
                        className={`${styles.fabButton}`}
                        onClick={handleFilter}
                    >
                        {filter.value ? `Annulla Filtro` : `Filtra per Note`}
                    </IonButton>
                    <IonButton
                        disabled={!!filter.value}
                        color="primary"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        style={{ margin: 0 }}
                        onClick={() => openVisitForm(null)}
                    >
                        <IonIcon icon={peopleOutline} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Nuova Visita
                        </IonLabel>
                    </IonButton>
                    {filter.value && (
                        <FilterBar
                            entitiesType={"visite"}
                            filter={filter}
                            setFilter={setFilter}
                        />
                    )}
                    {!filter.value && (
                        <DaySelector
                            currentDay={currentDay}
                            setCurrentDay={setCurrentDay}
                        />
                    )}
                    {!filter.value && (
                        <CalendarNavigator
                            mode="day"
                            currentDay={currentDay}
                            setCurrentDay={setCurrentDay}
                        />
                    )}
                    <ListVisits
                        filter={!!filter.value}
                        visits={filter.value ? visits : todaysVisits}
                    />
                </div>
            )}
            {isFormActive && (
                <FormVisit operationComplete={operationComplete} />
            )}
            {!isFormActive && (
                <>
                    <IonSegment mode="ios" value={pageMode}>
                        <IonSegmentButton
                            value="calendario"
                            onClick={() => dispatch(setPageMode("calendario"))}
                        >
                            <IonIcon icon={calendarOutline} />
                            <IonLabel>Calendario</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton
                            value="lista"
                            onClick={() => dispatch(setPageMode("lista"))}
                        >
                            <IonIcon icon={listOutline} />
                            <IonLabel>Lista</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </>
            )}
        </>
    );
};

export default AppuntamentiPage;
