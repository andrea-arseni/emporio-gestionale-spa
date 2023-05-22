import {
    IonLoading,
    IonList,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import {
    useState,
    FormEvent,
    SetStateAction,
    Dispatch,
    useEffect,
} from "react";
import { Lavoro } from "../../../entities/lavoro.model";
import { Step } from "../../../entities/step.model";
import useInput from "../../../hooks/use-input";
import { lavoroType, possibiliLavoroTypes } from "../../../types/lavoro_types";
import axiosInstance from "../../../utils/axiosInstance";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import useErrorHandler from "../../../hooks/use-error-handler";

const StepForm: React.FC<{
    lavoro: Lavoro;
    step: Step | null;
    backToList: () => void;
    setCurrentLavoro: Dispatch<SetStateAction<Lavoro | null>>;
}> = (props) => {
    let statusChangedDescription: string | null = null;
    let stepDescription =
        props.step && props.step.descrizione ? props.step.descrizione : null;

    if (
        props.step &&
        props.step.descrizione &&
        props.step.descrizione.includes("***")
    ) {
        const partiDescrizione = props.step.descrizione.split("***");
        statusChangedDescription = partiDescrizione[0].trim();
        stepDescription = partiDescrizione[1].trim();
    }

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [querySuccessfull, isQuerySuccessfull] = useState<boolean>(false);

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const {
        inputValue: inputDescrizioneValue,
        inputIsInvalid: inputDescrizioneIsInvalid,
        inputIsTouched: inputDescrizioneIsTouched,
        inputTouchedHandler: inputDescrizioneTouchedHandler,
        inputChangedHandler: inputDescrizioneChangedHandler,
        reset: inputDescrizioneReset,
    } = useInput((el) => el.toString().length > 0, stepDescription);

    const [status, setStatus] = useState<lavoroType>(
        props.lavoro.status as lavoroType
    );

    const [statusChanged, setStatusChanged] = useState<boolean>(false);

    const isFormValid =
        (!props.step && (inputDescrizioneValue || statusChanged)) ||
        (props.step && !inputDescrizioneIsInvalid && inputDescrizioneIsTouched);

    const getDescrizioneCompleta = statusChangedDescription
        ? statusChangedDescription + "***" + inputDescrizioneValue
        : inputDescrizioneValue;

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        const url = `lavori/${props.lavoro!.id}/steps`;
        const reqBody = {
            lavoroStatus: status.toUpperCase(),
            stepMessage: getDescrizioneCompleta,
            descrizione: getDescrizioneCompleta,
        };
        try {
            props.step
                ? await axiosInstance.patch(`${url}/${props.step.id!}`, reqBody)
                : await axiosInstance.post(`${url}`, reqBody);
            setShowLoading(false);
            isQuerySuccessfull(true);
            presentAlert({
                header: "Ottimo",
                message: `Obiettivo aggiornato`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => {
                            props.setCurrentLavoro((prevLavoro) => {
                                return {
                                    ...prevLavoro,
                                    status: status.toUpperCase(),
                                } as Lavoro;
                            });
                            props.backToList();
                        },
                    },
                ],
            });
        } catch (error: any) {
            setShowLoading(false);
            errorHandler(error, "Procedura non riuscita");
        }
    };

    const changeLavoroType = (e: any) => {
        setStatus(e.detail.value);
        setStatusChanged(true);
    };

    useEffect(() => {
        const isFormValid =
            (!props.step && (inputDescrizioneValue || statusChanged)) ||
            (props.step && !inputDescrizioneIsInvalid);

        const submitForm = async () => {
            setShowLoading(true);
            const url = `lavori/${props.lavoro!.id}/steps`;
            const reqBody = {
                lavoroStatus: status.toUpperCase(),
                stepMessage: getDescrizioneCompleta,
                descrizione: getDescrizioneCompleta,
            };
            try {
                props.step
                    ? await axiosInstance.patch(
                          `${url}/${props.step.id!}`,
                          reqBody
                      )
                    : await axiosInstance.post(`${url}`, reqBody);
                setShowLoading(false);
                isQuerySuccessfull(true);
                presentAlert({
                    header: "Ottimo",
                    message: `Obiettivo aggiornato`,
                    buttons: [
                        {
                            text: "OK",
                            handler: () => {
                                props.setCurrentLavoro((prevLavoro) => {
                                    return {
                                        ...prevLavoro,
                                        status: status.toUpperCase(),
                                    } as Lavoro;
                                });
                                props.backToList();
                            },
                        },
                    ],
                });
            } catch (error: any) {
                setShowLoading(false);
                errorHandler(error, "Procedura non riuscita");
            }
        };

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (isFormValid && !isError && e.key === "Enter") {
                if (querySuccessfull) {
                    hideAlert();
                    props.backToList();
                } else {
                    await submitForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [
        presentAlert,
        isError,
        errorHandler,
        hideAlert,
        props,
        getDescrizioneCompleta,
        inputDescrizioneIsInvalid,
        inputDescrizioneIsTouched,
        inputDescrizioneValue,
        querySuccessfull,
        status,
        statusChanged,
    ]);

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                {!props.step && (
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
                <TextArea
                    title="Descrizione Aggiornamento"
                    inputValue={inputDescrizioneValue}
                    inputIsInvalid={inputDescrizioneIsInvalid}
                    inputChangeHandler={inputDescrizioneChangedHandler}
                    inputTouchHandler={inputDescrizioneTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputDescrizioneReset}
                    autofocus
                />
                <IonButton
                    expand="block"
                    disabled={!isFormValid}
                    onClick={(e) => submitForm(e)}
                >
                    Aggiorna Obiettivo
                </IonButton>
            </IonList>
        </form>
    );
};

export default StepForm;
