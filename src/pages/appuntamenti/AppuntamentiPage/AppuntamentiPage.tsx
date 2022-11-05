import {
    IonContent,
    IonIcon,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
} from "@ionic/react";
import { calendarOutline, listOutline, trashBinOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
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
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import Modal from "../../../components/modal/Modal";

const AppuntamentiPage: React.FC<{}> = () => {
    const [presentAlert] = useIonAlert();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [currentWeek, setCurrentWeek] = useState<Giorno[]>(
        setWeek(new Date())
    );
    const [currentDay, setCurrentDay] = useState<Date>(
        new Date().getDay() === 0
            ? new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
            : new Date()
    );

    const [visits, setVisits] = useState<Visit[]>([]);

    const [update, doUpdate] = useState<number>(0);

    const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);

    const [pageMode, setPageMode] = useState<"calendario" | "lista" | "form">(
        "calendario"
    );

    const openVisitForm = (visit: Visit | null) => {
        setCurrentVisit(visit);
        setPageMode("form");
    };

    const backToList = () => {
        setPageMode("calendario");
        setCurrentVisit(null);
    };

    const operationComplete = () => {
        doUpdate((prevState) => ++prevState);
        backToList();
    };

    const changeDay = useCallback(
        (newDay: Date) => {
            // è il giorno nella stessa settimana
            const isDayInTheSameWeek = currentWeek.find((el) =>
                areDateEquals(el.date, newDay)
            );
            // se no cambia la settimana
            if (!isDayInTheSameWeek) {
                const newWeek = setWeek(newDay);
                setCurrentWeek(newWeek);
            }
        },
        [currentWeek]
    );

    useEffect(() => {
        changeDay(currentDay);
    }, [currentDay, changeDay]);

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
                setShowLoading(false);
                setVisits(res.data.data);
            } catch (e: any) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => {},
                    "Visite richieste non disponibili",
                    presentAlert
                );
            }
        };
        setShowLoading(true);
        fetchVisits();
    }, [currentWeek, presentAlert, update]);

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
                <>
                    <FormTitle
                        title={
                            currentVisit && currentVisit.id
                                ? "Modifica Visita"
                                : "Nuova Visita"
                        }
                        handler={backToList}
                        backToList
                    />
                    <FormVisit
                        operationComplete={operationComplete}
                        visit={currentVisit}
                    />
                </>
            )}
            {pageMode !== "form" && (
                <>
                    <IonSegment mode="ios" value={pageMode}>
                        <IonSegmentButton
                            value="calendario"
                            onClick={() => setPageMode("calendario")}
                        >
                            <IonIcon icon={calendarOutline} />
                            <IonLabel>Calendario</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton
                            value="lista"
                            onClick={() => setPageMode("lista")}
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
