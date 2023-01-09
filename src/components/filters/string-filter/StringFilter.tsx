import { IonList, IonItem, IonLabel, IonInput, IonButton } from "@ionic/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppDispatch } from "../../../hooks";
import styles from "../Filter.module.css";

const StringFilter: React.FC<{
    setFilter: any;
    filter: {
        filter: string | undefined;
        value?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
    localQuery?: boolean;
}> = (props) => {
    const dispatch = useAppDispatch();

    const [value, setValue] = useState<string | null>(null);

    const submitForm = async () => {
        const filterObj = {
            filter: props.filter.filter,
            value: value!,
        };
        props.localQuery
            ? props.setFilter(filterObj)
            : dispatch(props.setFilter(filterObj));
        props.setFilterMode("default");
    };

    return (
        <div className={styles.form}>
            <IonList className={styles.list}>
                <IonItem>
                    <IonLabel position="floating">{`Testo in "${props.filter.filter}"`}</IonLabel>
                    <IonInput
                        lang="it-IT"
                        type="text"
                        value={value}
                        onIonChange={(e) => setValue(e.detail.value!.trim())}
                    ></IonInput>
                </IonItem>
                <IonButton
                    onClick={() => submitForm()}
                    className={styles.button}
                    expand="full"
                    mode="ios"
                    color="primary"
                    type="submit"
                    disabled={!value || value.trim() === ""}
                >
                    Applica filtro
                </IonButton>
            </IonList>
        </div>
    );
};

export default StringFilter;
