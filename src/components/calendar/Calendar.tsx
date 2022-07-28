import {
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";
import { Visit } from "../../entities/visit.model";
import useSize from "../../hooks/use-size";
import { areDateEquals, Giorno } from "../../utils/timeUtils";
import styles from "./Calendar.module.css";

const Calendar: React.FC<{
    currentWeek: Giorno[];
    currentDay: Date;
    visits: Visit[];
    openVisitForm: (date: Date, time: string, visit: Visit | null) => void;
}> = (props) => {
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

    const handleClick = (
        e: any,
        date: Date,
        time: string,
        visit: Visit | null
    ) => {
        if (e.detail === 2) props.openVisitForm(date, time, visit);
    };

    const getWeekGrid = () => props.currentWeek.map((el) => getGrid(el));

    const getDayGrid = () => {
        const selectedDay = props.currentWeek.find((el) =>
            areDateEquals(el.date, props.currentDay)
        );
        return getGrid(selectedDay!);
    };

    const getMeetings = (dataAgenda: Date, oraAgenda: string) => {
        // ritorna tutte quelle visite che sono nello stesso giorno alla stessa ora
        return props.visits
            .filter((visit: Visit) => {
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
            })
            .map((el) => (
                <div className={styles.app} key={el.id! + Math.random() * 1000}>
                    App
                </div>
            ));
    };

    const getGrid = (day: Giorno) => {
        const grid: string[] = [];
        for (let i = 9; i < 21; i++) {
            ["00", "15", "30", "45"].forEach((minutes) => {
                const hour = i < 10 ? "0" + i : i.toString();
                grid.push(`${hour}:${minutes}`);
            });
        }
        return (
            <IonCol key={Date.now() + Math.random() * 1000}>
                <IonList className={styles.list}>
                    {widthScreen >= 700 && (
                        <IonItem color="primary">
                            <IonLabel>{day.giornoSettimana}</IonLabel>
                        </IonItem>
                    )}
                    {grid.map((el) => (
                        <div
                            className={`${styles.item} ${
                                isNow(day.date, el) ? styles.now : ""
                            } ${!isToday(day.date) ? `gray` : ``}`}
                            key={Date.now() + Math.random() * 1000}
                        >
                            <div
                                onClick={(e) =>
                                    handleClick(e, day.date, el, null)
                                }
                                className={styles.app}
                                slot="start"
                            >
                                {el}
                            </div>
                            <div className={styles.appFrame}>
                                {getMeetings(day.date, el)}
                            </div>
                        </div>
                    ))}
                </IonList>
            </IonCol>
        );
    };

    return widthScreen < 700 ? (
        <IonGrid className={styles.grid}>
            <IonRow>{getDayGrid()}</IonRow>
        </IonGrid>
    ) : (
        <IonGrid className={styles.grid}>
            <IonRow>{getWeekGrid()}</IonRow>
        </IonGrid>
    );
};

export default Calendar;
