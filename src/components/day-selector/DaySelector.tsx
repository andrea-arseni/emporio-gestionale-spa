import {
    DatetimeChangeEventDetail,
    IonButton,
    IonIcon,
    IonLabel,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import DatePicker from "../date-picker/DatePicker";
import styles from "./DaySelector.module.css";

const DaySelector: React.FC<{
    currentDay: Date;
    setCurrentDay: Dispatch<SetStateAction<Date>>;
}> = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const setNewDate = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const date = new Date(e.detail.value!.toString());
        props.setCurrentDay(date);
        setIsOpen(false);
    };

    return (
        <>
            <IonButton
                className={styles.daySelector}
                expand="full"
                mode="ios"
                color="dark"
                onClick={() => setIsOpen(true)}
            >
                <IonIcon icon={calendarOutline} />
                <IonLabel>Cambia Giorno</IonLabel>
            </IonButton>
            {isOpen && (
                <DatePicker
                    closePicker={() => setIsOpen(false)}
                    minValue="2019-01-01T00:00:00"
                    maxValue="2040-05-31T23:59:59"
                    changeHandler={setNewDate}
                    value={props.currentDay.toISOString()}
                    sundayDisabled
                />
            )}
        </>
    );
};

export default DaySelector;
