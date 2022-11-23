import {
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";
import { memo, useEffect, useRef } from "react";
import { Visit } from "../../entities/visit.model";
import useSize from "../../hooks/use-size";
import { areDateEquals, getDateAsString, Giorno } from "../../utils/timeUtils";
import CalendarItem from "./calendar-item/CalendarItem";
import CalendarModal from "./calendar-modal/CalendarModal";
import styles from "./Calendar.module.css";
import VisitItem from "./visit-item/VisitItem";

const Calendar: React.FC<{
    currentWeek: Giorno[];
    currentDay: Date;
    visits: Visit[];
    openVisitForm: (visit: Visit | null) => void;
}> = (props) => {
    const timeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (timeRef.current) {
                timeRef.current!.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 400);
        return () => clearTimeout(timeOut);
    }, [timeRef, props.currentWeek]);

    const isToday = (dayProposed: Date) =>
        areDateEquals(new Date(), dayProposed);

    const isNow = (dayProposed: Date, time: string) => {
        return (
            isToday(dayProposed) &&
            new Date().getHours() === Number.parseInt(time.split(":")[0]) &&
            new Date().getMinutes() - Number.parseInt(time.split(":")[1]) <=
                15 &&
            new Date().getMinutes() - Number.parseInt(time.split(":")[1]) > 0
        );
    };

    const [widthScreen] = useSize();

    const getWeekGrid = () => props.currentWeek.map((el) => getGrid(el));

    const getDayGrid = () => {
        const selectedDay = props.currentWeek.find((el) =>
            areDateEquals(el.date, props.currentDay)
        );
        if (!selectedDay) return null;
        return getGrid(selectedDay!);
    };

    const getVisiteInerenti = (dataAgenda: Date, oraAgenda: string) => {
        return props.visits.filter((visit: Visit) => {
            const dataVisita = new Date(visit.quando!);
            return (
                dataAgenda.getDate() === dataVisita.getDate() &&
                dataVisita.getHours() ===
                    Number.parseInt(oraAgenda.split(":")[0]) &&
                dataVisita.getMinutes() -
                    Number.parseInt(oraAgenda.split(":")[1]) <
                    15 &&
                dataVisita.getMinutes() -
                    Number.parseInt(oraAgenda.split(":")[1]) >=
                    0
            );
        });
    };

    const getMeetings = (dataAgenda: Date, oraAgenda: string) => {
        // ritorna tutte quelle visite che sono nello stesso giorno alla stessa ora
        return getVisiteInerenti(dataAgenda, oraAgenda).map((visita) => (
            <VisitItem key={visita.id + "meeting"} visita={visita} />
        ));
    };

    const getGrid = (day: Giorno) => {
        const grid: string[] = [];
        for (let i = 8; i < 21; i++) {
            ["00", "15", "30", "45"].forEach((minutes) => {
                const hour = i < 10 ? "0" + i : i.toString();
                grid.push(`${hour}:${minutes}`);
            });
        }
        return (
            <IonCol key={Date.now() + Math.random() * 1000}>
                <IonList className={`${styles.list}`}>
                    {grid.map((time) => {
                        const dateString = `${getDateAsString(
                            day.date
                        )}T${time}`;
                        return (
                            <div
                                ref={
                                    isNow(day.date, time) ? timeRef : undefined
                                }
                                className={`${styles.item} ${
                                    isNow(day.date, time) ? styles.now : ""
                                } ${!isToday(day.date) ? `gray` : ``}`}
                                key={`${dateString}`}
                            >
                                <CalendarItem
                                    dateAsString={dateString}
                                    openVisitForm={props.openVisitForm}
                                    visits={getVisiteInerenti(
                                        new Date(dateString),
                                        dateString.split("T")[1].substring(0, 5)
                                    )}
                                />
                                <div className={`${styles.appFrame}`}>
                                    {getMeetings(day.date, time)}
                                </div>
                            </div>
                        );
                    })}
                </IonList>
            </IonCol>
        );
    };

    const getDayWeekNames = () => {
        const cols = props.currentWeek.map((el) => (
            <IonCol key={el.giornoSettimana}>
                <IonItem
                    color="primary"
                    style={{ borderRight: "1px solid lightgray" }}
                >
                    <IonLabel className="centered">
                        {el.giornoSettimana} {el.date.getDate()}
                    </IonLabel>
                </IonItem>
            </IonCol>
        ));
        return <IonRow>{cols}</IonRow>;
    };

    return widthScreen < 700 ? (
        <IonGrid className={styles.bigGrid}>
            <IonRow>{getDayGrid()}</IonRow>
            <CalendarModal />
        </IonGrid>
    ) : (
        <>
            <IonGrid className={styles.upperGrid}>{getDayWeekNames()}</IonGrid>
            <IonGrid className={styles.littleGrid}>
                <IonRow>{getWeekGrid()}</IonRow>
                <CalendarModal />
            </IonGrid>
        </>
    );
};

export default memo(Calendar);
