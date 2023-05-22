import {
    IonList,
    IonLoading,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Lavoro } from "../../../entities/lavoro.model";
import useInput from "../../../hooks/use-input";
import { lavoroType, possibiliLavoroTypes } from "../../../types/lavoro_types";
import axiosInstance from "../../../utils/axiosInstance";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormInput from "../../form-components/form-input/FormInput";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";

const LavoroForm: React.FC<{
    lavoro: Lavoro | null;
    backToList: () => void;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [nameUpdated, isNameUpdated] = useState<boolean>(false);

    const { hasBeenClicked, setHasBeenClicked } = useSingleClick();

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

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

    const getSubmitText = () => {
        if (!props.lavoro && !inputTitoloIsTouched)
            return "Titolo obbligatorio";
        if (!props.lavoro && inputTitoloIsInvalid) return "Titolo invalido";
        if (!props.lavoro && !inputDescrizioneValue)
            return "Descrizione obbligatoria";
        return `${props.lavoro ? "Modifica" : "Aggiungi"} Obiettivo`;
    };

    const eseguiForm = useCallback(async () => {
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
            isNameUpdated(true);
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
            errorHandler(error, "Procedura non riuscita");
        }
    }, [
        errorHandler,
        inputDescrizioneValue,
        inputTitoloValue,
        presentAlert,
        props,
        status,
    ]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    const changeLavoroType = (e: any) => setStatus(e.detail.value);

    useEffect(() => {
        const isFormValid =
            (props.lavoro &&
                (inputTitoloValue !== props.lavoro.titolo ||
                    status !== props.lavoro.status)) ||
            (!props.lavoro &&
                inputTitoloValue.toString().length >= 10 &&
                inputTitoloValue.toString().length <= 45 &&
                inputDescrizioneValue.toString().trim().length > 0 &&
                status);

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (isFormValid && e.key === "Enter" && !isError) {
                setHasBeenClicked(true);
                if (nameUpdated) {
                    hideAlert();
                    props.backToList();
                } else if (hasBeenClicked) {
                    await eseguiForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [
        presentAlert,
        hideAlert,
        errorHandler,
        eseguiForm,
        setHasBeenClicked,
        hasBeenClicked,
        isError,
        props,
        nameUpdated,
        inputDescrizioneValue,
        inputTitoloValue,
        status,
    ]);

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormInput
                    autofocus
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
                    {getSubmitText()}
                </IonButton>
            </IonList>
        </form>
    );
};

export default LavoroForm;
