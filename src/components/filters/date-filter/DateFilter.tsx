import {
    IonList,
    IonItem,
    IonLabel,
    IonDatetime,
    IonButton,
    DatetimeChangeEventDetail,
    IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
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
        <>
            {(selectingStartDate || selectingEndDate) && (
                <div className={styles.background}>
                    <div
                        className={styles.backdrop}
                        onClick={() => {
                            setSelectingStartDate(false);
                            setSelectingEndDate(false);
                        }}
                    ></div>
                    <IonDatetime
                        className={styles.datapicker}
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
                </div>
            )}
            {!selectingStartDate && !selectingEndDate && (
                <form onSubmit={submitForm} className={styles.form}>
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
                </form>
            )}
        </>
    );
};

export default DateFilter;
