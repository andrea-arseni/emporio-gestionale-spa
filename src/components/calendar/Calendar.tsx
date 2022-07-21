import {
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";
import useSize from "../../hooks/use-size";
import { Giorno } from "../../utils/timeUtils";
import styles from "./Calendar.module.css";

const Calendar: React.FC<{ currentWeek: Giorno[]; currentDay: Date }> = (
    props
) => {
    const isToday = (dayProposed: Date) =>
        new Date().toDateString() === dayProposed.toDateString();

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
        const selectedDay = props.currentWeek.find(
            (el) => el.date.toDateString() === props.currentDay.toDateString()
        );
        return getGrid(selectedDay!);
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
                    {grid.map((el) => (
                        <IonItem
                            className={`${styles.item} ${
                                isNow(day.date, el) ? styles.now : ""
                            }`}
                            lines="none"
                            color={
                                !isNow(day.date, el) && isToday(day.date)
                                    ? `light`
                                    : ``
                            }
                            key={Date.now() + Math.random() * 1000}
                        >
                            <IonLabel>{el}</IonLabel>
                            <IonLabel>Ciao</IonLabel>
                        </IonItem>
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
