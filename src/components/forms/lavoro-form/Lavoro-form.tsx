import {
    IonList,
    useIonAlert,
    IonLoading,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { Lavoro } from "../../../entities/lavoro.model";
import useInput from "../../../hooks/use-input";
import { lavoroType, possibiliLavoroTypes } from "../../../types/lavoro_types";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormInput from "../../form-components/form-input/FormInput";

const LavoroForm: React.FC<{
    lavoro: Lavoro | null;
    backToList: () => void;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const {
        inputValue: inputTitoloValue,
        inputIsInvalid: inputTitoloIsInvalid,
        inputIsTouched: inputTitoloIsTouched,
        inputTouchedHandler: inputTitoloTouchedHandler,
        inputChangedHandler: inputTitoloChangedHandler,
        reset: inputTitoloReset,
    } = useInput(
        (titolo) =>
            titolo.toString().length >= 10 && titolo.toString().length <= 45,
        props.lavoro && props.lavoro.titolo !== undefined
            ? props.lavoro.titolo
            : null
    );

    const {
        inputValue: inputDescrizioneValue,
        inputIsInvalid: inputDescrizioneIsInvalid,
        inputTouchedHandler: inputDescrizioneTouchedHandler,
        inputChangedHandler: inputDescrizioneChangedHandler,
        reset: inputDescrizioneReset,
    } = useInput(() => true);

    const [status, setStatus] = useState<lavoroType>(
        props.lavoro ? (props.lavoro.status as lavoroType) : "A_APERTO"
    );

    const isFormValid =
        (props.lavoro &&
            (inputTitoloValue !== props.lavoro.titolo ||
                status !== props.lavoro.status)) ||
        (!props.lavoro &&
            !inputTitoloIsInvalid &&
            inputTitoloIsTouched &&
            inputDescrizioneValue &&
            status);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const reqBody = {
            titolo: inputTitoloValue,
            status: status.toUpperCase(),
            descrizione: inputDescrizioneValue,
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

    const changeLavoroType = (e: any) => setStatus(e.detail.value);

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormInput
                    title=" Titolo (tra 10 e 45 lettere)"
                    inputValue={inputTitoloValue}
                    type={"text"}
                    inputIsInvalid={inputTitoloIsInvalid}
                    inputChangeHandler={inputTitoloChangedHandler}
                    inputTouchHandler={inputTitoloTouchedHandler}
                    errorMessage={"Lunghezza non valida"}
                    reset={inputTitoloReset}
                />
                {props.lavoro && (
                    <IonItem>
                        <IonLabel position="floating">Status</IonLabel>
                        <IonSelect
                            cancelText="Torna Indietro"
                            mode="ios"
                            interface="action-sheet"
                            value={status}
                            onIonChange={changeLavoroType}
                        >
                            {possibiliLavoroTypes.map((el) => (
                                <IonSelectOption
                                    key={el.value.toLowerCase()}
                                    value={el.value}
                                >
                                    {el.text}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )}
                {!props.lavoro && (
                    <TextArea
                        title="Descrizione"
                        inputValue={inputDescrizioneValue}
                        inputIsInvalid={inputDescrizioneIsInvalid}
                        inputChangeHandler={inputDescrizioneChangedHandler}
                        inputTouchHandler={inputDescrizioneTouchedHandler}
                        errorMessage={"Input non valido"}
                        reset={inputDescrizioneReset}
                    />
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
