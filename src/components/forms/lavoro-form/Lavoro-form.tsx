import {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonNote,
    useIonAlert,
    IonLoading,
    IonButton,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { Lavoro } from "../../../entities/lavoro.model";
import { lavoroType, possibiliLavoroTypes } from "../../../types/lavoro_types";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import FormSelect from "../../form-components/form-select/FormSelect";

const LavoroForm: React.FC<{
    lavoro: Lavoro | null;
    backToList: () => void;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const [titolo, setTitolo] = useState<string | null>(
        props.lavoro ? props.lavoro.titolo : null
    );

    const isTitleValid =
        !titolo || (titolo.length >= 10 && titolo.length <= 45);

    const [descrizione, setDescrizione] = useState<string | null>(null);

    const [status, setStatus] = useState<lavoroType>(
        props.lavoro ? (props.lavoro.status as lavoroType) : "APERTO"
    );

    const isFormValid =
        (titolo &&
            titolo.length >= 10 &&
            titolo.length <= 45 &&
            props.lavoro &&
            (titolo !== props.lavoro.titolo ||
                status !== props.lavoro.status)) ||
        (!props.lavoro && titolo && descrizione && status);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const reqBody = {
            titolo: titolo,
            status: status.toUpperCase(),
            descrizione: descrizione,
        };
        setShowLoading(true);
        try {
            props.lavoro
                ? await axiosInstance.patch(
                      `lavori/${props.lavoro!.id}`,
                      reqBody
                  )
                : await axiosInstance.post(`lavori`, reqBody);
            setShowLoading(false);
            presentAlert({
                header: "Ottimo",
                message: `Obiettivo ${props.lavoro ? "modificato" : "creato"}`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => props.backToList(),
                    },
                ],
            });
        } catch (error: any) {
            setShowLoading(false);
            errorHandler(
                error,
                () => {},
                "Procedura non riuscita",
                presentAlert
            );
        }
    };

    const changeLavoroType = (e: any, type: any) => {
        setStatus(e.detail.value);
    };

    const getPossibleStatusValues = () =>
        !props.lavoro
            ? possibiliLavoroTypes
            : possibiliLavoroTypes.filter((el) => el !== "APERTO");

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <IonItem>
                    <IonLabel position="floating">
                        Titolo (tra 10 e 45 lettere)
                    </IonLabel>
                    <IonInput
                        type="text"
                        value={titolo}
                        onIonChange={(e) => setTitolo(e.detail.value!)}
                    ></IonInput>
                    <IonNote color={isTitleValid ? "primary" : "danger"}>
                        {`${titolo ? titolo.length : 0} letter${
                            titolo?.length === 1 ? "a" : "e"
                        } usat${titolo?.length === 1 ? "a" : "e"}`}
                    </IonNote>
                </IonItem>
                {props.lavoro && (
                    <FormSelect
                        title="Status"
                        value={status}
                        function={changeLavoroType}
                        type={"status"}
                        possibleValues={getPossibleStatusValues()}
                    />
                )}
                {!props.lavoro && (
                    <IonItem>
                        <IonLabel position="floating">Descrizione</IonLabel>
                        <IonTextarea
                            auto-grow
                            rows={4}
                            value={descrizione}
                            onIonChange={(e) => {
                                setDescrizione(e.detail.value!);
                            }}
                        ></IonTextarea>
                    </IonItem>
                )}
                <IonButton
                    expand="block"
                    disabled={!isFormValid}
                    onClick={(e) => submitForm(e)}
                >
                    {props.lavoro ? "Modifica" : "Aggiungi"} Obiettivo
                </IonButton>
            </IonList>
        </form>
    );
};

export default LavoroForm;
