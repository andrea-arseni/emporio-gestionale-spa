import {
    DatetimeChangeEventDetail,
    IonButton,
    IonDatetime,
    IonIcon,
    IonLabel,
} from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../modal/Modal";

const DaySelector: React.FC<{
    currentDay: Date;
    setCurrentDay: Dispatch<SetStateAction<Date>>;
}> = (props) => {
    const isNotSunday = (dateString: string) =>
        new Date(dateString).getDay() !== 0;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const setNewDate = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const date = new Date(e.detail.value!.toString());
        props.setCurrentDay(date);
        setIsOpen(false);
    };

    return (
        <>
            <IonButton
                className="spaces"
                expand="full"
                mode="ios"
                color="dark"
                fill="outline"
                onClick={() => setIsOpen(true)}
            >
                <IonIcon icon={calendarOutline} />
                <IonLabel>Cambia Giorno</IonLabel>
            </IonButton>
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Seleziona un altro giorno"
                handler={() => setIsOpen(false)}
            >
                <IonDatetime
                    value={props.currentDay.toISOString()}
                    mode="ios"
                    min="2019-01-01T00:00:00"
                    max="2040-05-31T23:59:59"
                    isDateEnabled={isNotSunday}
                    locale="it-IT"
                    firstDayOfWeek={1}
                    presentation="date"
                    onIonChange={setNewDate}
                ></IonDatetime>
            </Modal>
        </>
    );
};

export default DaySelector;
