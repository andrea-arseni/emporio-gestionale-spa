import { IonList, IonItem, IonLabel, IonButton, IonInput } from "@ionic/react";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../Filter.module.css";

const NumberFilter: React.FC<{
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
    negativeForbidden?: boolean;
}> = (props) => {
    const [minValue, setMinValue] = useState<string | null>(null);

    const [maxValue, setMaxValue] = useState<string | null>(null);

    const submitForm = async () => {
        props.setFilter({
            filter: props.filter.filter,
            min: minValue ? +minValue : undefined,
            max: maxValue ? +maxValue : undefined,
        });
        props.setFilterMode("default");
    };

    return (
        <div className={styles.form}>
            <IonList className={styles.list}>
                <IonItem>
                    <IonLabel position="floating">Valore minimo</IonLabel>
                    <IonInput
                        lang="it-IT"
                        type="number"
                        value={minValue}
                        min={props.negativeForbidden ? 0 : undefined}
                        max={maxValue ? maxValue : undefined}
                        onIonChange={(e) => setMinValue(e.detail.value!)}
                    ></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Valore massimo</IonLabel>
                    <IonInput
                        lang="it-IT"
                        type="number"
                        value={maxValue}
                        min={minValue ? minValue : undefined}
                        onIonChange={(e) => setMaxValue(e.detail.value!)}
                    ></IonInput>
                </IonItem>

                <IonButton
                    onClick={() => submitForm()}
                    className={styles.button}
                    expand="full"
                    mode="ios"
                    color="primary"
                    type="submit"
                    disabled={!minValue && !maxValue}
                >
                    Applica filtro
                </IonButton>
            </IonList>
        </div>
    );
};

export default NumberFilter;
