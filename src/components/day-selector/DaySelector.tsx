import {
    DatetimeChangeEventDetail,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonIcon,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { calendarOutline, closeOutline } from "ionicons/icons";
import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./DaySelector.module.css";

const DaySelector: React.FC<{
    currentDay: Date;
    setCurrentDay: Dispatch<SetStateAction<Date>>;
}> = (props) => {
    const isNotSunday = (dateString: string) => {
        const date = new Date(dateString);
        const utcDay = date.getUTCDay();
        return utcDay !== 0;
    };

    const modal = useRef<HTMLIonModalElement>(null);

    const dismiss = () => modal.current?.dismiss();

    const setNewDate = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const date = new Date(e.detail.value!.toString());
        props.setCurrentDay(date);
        dismiss();
    };

    return (
        <>
            <IonButton
                className={styles.spaces}
                expand="full"
                mode="ios"
                color="dark"
                fill="outline"
                id="open-modal"
            >
                <IonIcon icon={calendarOutline} />
                <IonLabel>Cambia Giorno</IonLabel>
            </IonButton>
            <IonModal
                id="date-picker"
                ref={modal}
                trigger="open-modal"
                showBackdrop
            >
                <IonContent className={styles.modalContent}>
                    <IonToolbar>
                        <IonTitle>Seleziona un altro giorno</IonTitle>
                        <IonButtons slot="end">
                            <IonButton color="dark" onClick={() => dismiss()}>
                                <IonIcon
                                    slot="icon-only"
                                    icon={closeOutline}
                                ></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
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
                </IonContent>
            </IonModal>
        </>
    );
};

export default DaySelector;
