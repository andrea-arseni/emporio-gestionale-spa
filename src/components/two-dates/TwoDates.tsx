import { IonList, IonItem, IonButton, IonLabel, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getDayName } from "../../utils/timeUtils";
import DatePicker from "../date-picker/DatePicker";
import styles from "./TwoDates.module.css";

const TwoDates: React.FC<{
    action: (input: any) => void;
    text: string;
    limit?: Date;
    goBack?: boolean;
    getBack?: () => void;
}> = (props) => {
    const [selectingStartDate, setSelectingStartDate] =
        useState<boolean>(false);

    const [selectingEndDate, setSelectingEndDate] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string | null>(null);

    const [endDate, setEndDate] = useState<string | null>(null);

    const setNewDate = (e: CustomEvent<any>) => {
        const date = e.detail.value!.split("T")[0];
        selectingStartDate ? setStartDate(date) : setEndDate(date);
        setSelectingStartDate(false);
        setSelectingEndDate(false);
    };

    const closePicker = () => {
        setSelectingStartDate(false);
        setSelectingEndDate(false);
    };

    useEffect(() => {
        const formIsValid = startDate && endDate;

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (formIsValid && e.key === "Enter") {
                props.action({ startDate, endDate });
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [props, endDate, startDate]);

    return (
        <>
            {(selectingStartDate || selectingEndDate) && (
                <DatePicker
                    closePicker={closePicker}
                    minValue={
                        selectingEndDate && startDate
                            ? startDate
                            : "2019-01-01T00:00:00"
                    }
                    maxValue={
                        selectingStartDate && endDate
                            ? endDate
                            : props.limit
                            ? props.limit.toISOString()
                            : "2040-05-31T23:59:59"
                    }
                    changeHandler={setNewDate}
                />
            )}
            {!selectingStartDate && !selectingEndDate && (
                <div className={styles.form}>
                    <IonList className={styles.list}>
                        <IonItem lines="none">
                            <IonButton
                                onClick={() => setSelectingStartDate(true)}
                            >
                                {`Data iniziale`}
                            </IonButton>
                            {startDate && (
                                <>
                                    <IonLabel slot="end">
                                        {getDayName(
                                            new Date(startDate),
                                            "short"
                                        )}
                                    </IonLabel>
                                    <IonButton
                                        slot="end"
                                        fill="clear"
                                        color="light"
                                        onClick={() => setStartDate(null)}
                                    >
                                        <IonIcon
                                            color="dark"
                                            slot="icon-only"
                                            icon={closeOutline}
                                        ></IonIcon>
                                    </IonButton>
                                </>
                            )}
                        </IonItem>
                        <IonItem lines="none">
                            <IonButton
                                onClick={() => setSelectingEndDate(true)}
                            >
                                {`Data finale`}
                            </IonButton>
                            {endDate && (
                                <>
                                    <IonLabel slot="end">
                                        {getDayName(new Date(endDate), "short")}
                                    </IonLabel>
                                    <IonButton
                                        slot="end"
                                        fill="clear"
                                        color="light"
                                        onClick={() => setEndDate(null)}
                                    >
                                        <IonIcon
                                            color="dark"
                                            slot="icon-only"
                                            icon={closeOutline}
                                        ></IonIcon>
                                    </IonButton>
                                </>
                            )}
                        </IonItem>

                        <IonButton
                            onClick={() => props.action({ startDate, endDate })}
                            className={styles.button}
                            mode="ios"
                            color="primary"
                            type="submit"
                            disabled={!startDate && !endDate}
                        >
                            {props.text}
                        </IonButton>

                        {props.goBack && (
                            <IonButton
                                onClick={() => props.getBack!()}
                                className={styles.button}
                                mode="ios"
                                color="light"
                                type="button"
                            >
                                Indietro
                            </IonButton>
                        )}
                    </IonList>
                </div>
            )}
        </>
    );
};

export default TwoDates;
