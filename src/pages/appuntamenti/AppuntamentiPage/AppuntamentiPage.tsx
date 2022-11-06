import {
    IonContent,
    IonIcon,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
} from "@ionic/react";
import { calendarOutline, listOutline } from "ionicons/icons";
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
    setPageMode,
} from "../../../store/appuntamenti-slice";
import { changeLoading } from "../../../store/ui-slice";

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

    const openVisitForm = (visit: Visit | null) => {
        dispatch(setCurrentVisit(visit));
        dispatch(setPageMode("form"));
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
            console.log(newDay);
            console.log(isDayInTheSameWeek);
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

    return (
        <IonContent className="page">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {pageMode === "calendario" && (
                <>
                    <DaySelector
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <CalendarNavigator
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
            {pageMode === "lista" && (
                <>
                    <DaySelector
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <CalendarNavigator
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    LISTA
                </>
            )}
            {pageMode === "form" && (
                <FormVisit operationComplete={operationComplete} />
            )}
            {pageMode !== "form" && (
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
