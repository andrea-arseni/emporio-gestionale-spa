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
import { useCallback, useEffect, useState } from "react";
import CalendarNavigator from "../../components/calendar-navigator/CalendarNavigator";
import Calendar from "../../components/calendar/Calendar";
import DaySelector from "../../components/day-selector/DaySelector";
import { getDateAsString, Giorno, setWeek } from "../../utils/timeUtils";
import axiosInstance from "../../utils/axiosInstance";

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

    const [pageMode, setPageMode] = useState<"calendario" | "lista">(
        "calendario"
    );

    const changeDay = useCallback(
        (newDay: Date) => {
            // è il giorno nella stessa settimana
            const isDayInTheSameWeek = currentWeek.find(
                (el) => el.date.toDateString() === newDay.toDateString()
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
            setShowLoading(true);
            try {
                const url = `visite/?filter=quando&startDate=${getDateAsString(
                    currentWeek[0].date
                )}&endDate=${getDateAsString(currentWeek[5].date)}`;
                const res = await axiosInstance.get(url);
                setShowLoading(false);
                const visits = res.data.data;
                // per ogni visita prendi la data
                visits.forEach((visit) => {});
                // per ogni giorno della settimana se giorno = data visita assegna visita a quel giorno
                // visualizza settimana
            } catch (e: any) {
                setShowLoading(false);
                console.log(e);
                presentAlert({
                    header: "Errore",
                    subHeader: `${
                        e.response ? "Visite richieste non disponibili" : ""
                    }`,
                    message: `${
                        e.response
                            ? e.response.data.message
                            : "Visite richieste non disponibili"
                    }`,
                    buttons: ["OK"],
                });
            }
        };
        fetchVisits();
    }, [currentWeek, presentAlert]);

    return (
        <IonContent className="page">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <DaySelector
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
            />
            {pageMode === "calendario" && (
                <>
                    <CalendarNavigator
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDay}
                    />
                    <Calendar
                        currentDay={currentDay}
                        currentWeek={currentWeek}
                    />
                </>
            )}
            {pageMode === "lista" && <>Lista</>}

            {/* 
            Calendar Part
            Appuntamenti Filter
            Appuntamenti Part
            */}
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
        </IonContent>
    );
};

export default AppuntamentiPage;
