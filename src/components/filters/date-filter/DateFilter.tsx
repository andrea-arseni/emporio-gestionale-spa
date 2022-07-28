import {
    IonList,
    IonItem,
    IonLabel,
    IonDatetime,
    IonButton,
    DatetimeChangeEventDetail,
} from "@ionic/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { getDayName } from "../../../utils/timeUtils";
import styles from "../Filter.module.css";

const DateFilter: React.FC<{
    filter: {
        filter: string | undefined;
        value?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
    setFilter: Dispatch<
        SetStateAction<{
            filter: string | undefined;
            value?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
        }>
    >;
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
}> = (props) => {
    const [selectingStartDate, setSelectingStartDate] =
        useState<boolean>(false);

    const [selectingEndDate, setSelectingEndDate] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string | null>(null);

    const [endDate, setEndDate] = useState<string | null>(null);

    const setNewDate = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const date = e.detail.value!.split("T")[0];
        selectingStartDate ? setStartDate(date) : setEndDate(date);
        setSelectingStartDate(false);
        setSelectingEndDate(false);
    };

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        props.setFilter((filter) => {
            return {
                filter: filter.filter,
                startDate: startDate!,
                endDate: endDate!,
            };
        });
        props.setFilterMode("default");
    };

    return (
        <form onSubmit={submitForm} className={styles.form}>
            {(selectingStartDate || selectingEndDate) && (
                <IonDatetime
                    mode="ios"
                    min={
                        selectingEndDate && startDate
                            ? startDate
                            : "2019-01-01T00:00:00"
                    }
                    max={
                        selectingStartDate && endDate
                            ? endDate
                            : "2040-05-31T23:59:59"
                    }
                    locale="it-IT"
                    firstDayOfWeek={1}
                    presentation="date"
                    onIonChange={(e) => setNewDate(e)}
                    size="fixed"
                />
            )}
            {!selectingStartDate && !selectingEndDate && (
                <IonList className={styles.list}>
                    <IonItem lines="none">
                        <IonButton onClick={() => setSelectingStartDate(true)}>
                            {`${
                                startDate ? "Cambia" : "Seleziona"
                            } la data iniziale`}
                        </IonButton>
                        {startDate && (
                            <IonLabel slot="end">
                                {getDayName(new Date(startDate), "long")}
                            </IonLabel>
                        )}
                    </IonItem>
                    <IonItem lines="none">
                        <IonButton onClick={() => setSelectingEndDate(true)}>
                            {`${
                                endDate ? "Cambia" : "Seleziona"
                            } la data finale`}
                        </IonButton>
                        {endDate && (
                            <IonLabel slot="end">
                                {getDayName(new Date(endDate), "long")}
                            </IonLabel>
                        )}
                    </IonItem>

                    <IonButton
                        className={styles.button}
                        expand="full"
                        mode="ios"
                        color="primary"
                        type="submit"
                        disabled={!startDate && !endDate}
                    >
                        Applica filtro
                    </IonButton>
                </IonList>
            )}
        </form>
    );
};

export default DateFilter;
