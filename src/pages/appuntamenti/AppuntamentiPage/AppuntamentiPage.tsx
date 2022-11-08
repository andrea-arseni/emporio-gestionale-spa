import {
    IonButton,
    IonContent,
    IonIcon,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
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

const AppuntamentiPage: React.FC<{}> = () => {
    const [presentAlert] = useIonAlert();

    const showLoading = useAppSelector((state) => state.ui.isLoading);

    const [currentWeek, setCurrentWeek] = useState<Giorno[]>(
        setWeek(new Date())
    );
    const [currentDay, setCurrentDay] = useState<Date>(
        new Date().getDay() === 0
            ? new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
            : new Date()
    );

    const [visits, setVisits] = useState<Visit[]>([]);

    const trigger = useAppSelector((state) => state.appuntamenti.trigger);

    const dispatch = useAppDispatch();

    const pageMode = useAppSelector((state) => state.appuntamenti.pageMode);

    const isFormActive = useAppSelector(
        (state) => state.appuntamenti.isFormActive
    );

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
        const fetchVisits = async () => {
            try {
                const url = `visite/?filter=quando&startDate=${getDateAsString(
                    currentWeek[0].date
                )}&endDate=${getDateAsString(
                    new Date(
                        currentWeek[5].date.getTime() + 1000 * 60 * 60 * 24
                    )
                )}`;
                const res = await axiosInstance.get(url);
                dispatch(changeLoading(false));
                setVisits(res.data.data);
            } catch (e: any) {
                dispatch(changeLoading(false));
                errorHandler(
                    e,
                    () => {},
                    "Visite richieste non disponibili",
                    presentAlert
                );
            }
        };
        dispatch(changeLoading(true));
        fetchVisits();
    }, [currentWeek, presentAlert, trigger, dispatch]);

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

    return (
        <IonContent className="page">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {pageMode === "calendario" && !isFormActive && (
                <>
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
                </>
            )}
            {pageMode === "lista" && !isFormActive && (
                <>
                    <IonButton
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
                    <DaySelector
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <CalendarNavigator
                        mode="day"
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <ListVisits visits={todaysVisits} />
                </>
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
        </IonContent>
    );
};

export default AppuntamentiPage;
