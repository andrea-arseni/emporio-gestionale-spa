import {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonButton,
    DatetimeChangeEventDetail,
    useIonAlert,
    IonLoading,
} from "@ionic/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Operazione } from "../../entities/operazione.model";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import { getDayName } from "../../utils/timeUtils";
import styles from "./OperationForm.module.css";

const FormOperation: React.FC<{
    operation: Operazione | null;
    setMode: Dispatch<SetStateAction<"form" | "list">>;
}> = (props) => {
    const [selectingDate, setSelectingDate] = useState<boolean>(false);

    const [operationDate, setOperationDate] = useState<string | null>(
        props.operation ? props.operation.data : null
    );

    const [operationImporto, setOperationImporto] = useState<number | null>(
        props.operation ? props.operation.importo : null
    );

    const [operationDescrizione, setOperationDescrizione] = useState<
        string | null
    >(props.operation ? props.operation.descrizione : null);

    const [presentAlert] = useIonAlert();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const inputImportoChangedHandler = (e: any) =>
        setOperationImporto(e.detail.value);

    const inputDescrizioneChangedHandler = (e: any) =>
        setOperationDescrizione(e.detail.value);

    const setNewDate = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        setOperationDate(e.detail.value!.toString().split("T")[0]);
        setSelectingDate(false);
    };

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        const reqBody = {
            data: operationDate,
            importo: operationImporto,
            descrizione: operationDescrizione,
        };
        try {
            await (props.operation
                ? axiosInstance.patch(
                      "operazioni/" + props.operation.id,
                      reqBody
                  )
                : axiosInstance.post("operazioni", reqBody));
            setShowLoading(false);
            props.setMode("list");
        } catch (e: any) {
            setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Creazione operazione non riuscita",
                presentAlert
            );
        }
    };

    return (
        <form onSubmit={submitForm} className={styles.form}>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            {selectingDate && (
                <IonDatetime
                    value={operationDate}
                    mode="ios"
                    min="2019-01-01T00:00:00"
                    max="2040-05-31T23:59:59"
                    locale="it-IT"
                    firstDayOfWeek={1}
                    presentation="date"
                    onIonChange={setNewDate}
                    size="fixed"
                />
            )}
            {!selectingDate && (
                <IonList>
                    <IonItem lines="none">
                        <IonButton onClick={() => setSelectingDate(true)}>
                            {`${
                                operationDate ? "Cambia" : "Seleziona"
                            } la data`}
                        </IonButton>
                        {operationDate && (
                            <IonLabel slot="end">
                                {getDayName(new Date(operationDate), "long")}
                            </IonLabel>
                        )}
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel>Importo in €</IonLabel>
                        <IonInput
                            slot="end"
                            type="number"
                            value={operationImporto}
                            onIonChange={(e) => inputImportoChangedHandler(e)}
                        ></IonInput>
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel>
                            <i>Descrizione:</i>
                        </IonLabel>
                        <IonTextarea
                            value={operationDescrizione}
                            rows={6}
                            onIonChange={(e) =>
                                inputDescrizioneChangedHandler(e)
                            }
                        ></IonTextarea>
                    </IonItem>
                    <IonButton
                        expand="full"
                        mode="ios"
                        color="primary"
                        type="submit"
                        disabled={
                            !operationDescrizione ||
                            !operationDate ||
                            !operationImporto
                        }
                    >
                        {`${
                            props.operation ? "Modifica " : "Crea nuova "
                        } visita`}
                    </IonButton>
                </IonList>
            )}
        </form>
    );
};

export default FormOperation;
