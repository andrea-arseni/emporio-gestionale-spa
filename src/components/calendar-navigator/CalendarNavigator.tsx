import { IonButton, IonIcon, IonToolbar } from "@ionic/react";
import { arrowBackOutline, arrowForwardOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import useSize from "../../hooks/use-size";
import { getDayName, setWeek } from "../../utils/timeUtils";
import Title from "../title/Title";
import styles from "./CalendarNavigator.module.css";

const CalendarNavigator: React.FC<{
    currentDay: Date;
    setCurrentDay: Dispatch<SetStateAction<Date>>;
}> = (props) => {
    const [widthScreen] = useSize();

    const getTitolo = () => {
        if (widthScreen < 700)
            return getDayName(
                props.currentDay,
                widthScreen > 385 ? "long" : "short"
            );
        const week = setWeek(props.currentDay);
        return `Da ${getDayName(week[0].date, "long")} a ${getDayName(
            week[5].date,
            "long"
        )}`;
    };

    const moveInTime = (mode: "forward" | "backward") => {
        let offset =
            mode === "backward" ? -1000 * 60 * 60 * 24 : +1000 * 60 * 60 * 24;

        if (widthScreen >= 700) offset = offset * 7;
        let newDay = new Date(props.currentDay.getTime() + offset);
        if (newDay.getDay() === 0)
            newDay = new Date(
                newDay.getTime() +
                    (mode === "backward"
                        ? -1000 * 60 * 60 * 24
                        : +1000 * 60 * 60 * 24)
            );
        props.setCurrentDay(newDay);
    };

    return (
        <IonToolbar mode="ios" className={styles.navigator}>
            <IonButton
                slot="start"
                fill="clear"
                color="light"
                onClick={moveInTime.bind(null, "backward")}
            >
                <IonIcon
                    color="dark"
                    slot="icon-only"
                    icon={arrowBackOutline}
                ></IonIcon>
            </IonButton>
            <Title>{getTitolo()}</Title>
            <IonButton
                slot="end"
                fill="clear"
                color="light"
                onClick={moveInTime.bind(null, "forward")}
            >
                <IonIcon
                    color="dark"
                    slot="icon-only"
                    icon={arrowForwardOutline}
                ></IonIcon>
            </IonButton>
        </IonToolbar>
    );
};

export default CalendarNavigator;
