import { useIonAlert, IonLoading, IonList, IonButton } from "@ionic/react";
import { useState, FormEvent, SetStateAction, Dispatch } from "react";
import { Lavoro } from "../../../entities/lavoro.model";
import { Step } from "../../../entities/step.model";
import useInput from "../../../hooks/use-input";
import { lavoroType, possibiliLavoroTypes } from "../../../types/lavoro_types";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import FormSelect from "../../form-components/form-select/FormSelect";
import TextArea from "../../form-components/text_area/TextArea";

const StepForm: React.FC<{
    lavoro: Lavoro;
    step: Step | null;
    backToList: () => void;
    setCurrentLavoro: Dispatch<SetStateAction<Lavoro | null>>;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const {
        inputValue: inputDescrizioneValue,
        inputIsInvalid: inputDescrizioneIsInvalid,
        inputTouchedHandler: inputDescrizioneTouchedHandler,
        inputChangedHandler: inputDescrizioneChangedHandler,
        reset: inputDescrizioneReset,
    } = useInput(
        () => true,
        props.step && props.step.descrizione !== undefined
            ? props.step.descrizione
            : null
    );

    const [status, setStatus] = useState<lavoroType>(
        props.lavoro.status as lavoroType
    );

    const isFormValid = inputDescrizioneValue && status;

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        const url = `lavori/${props.lavoro!.id}/steps`;
        const reqBody = {
            lavoroStatus: status.toUpperCase(),
            stepMessage: inputDescrizioneValue,
            descrizione: inputDescrizioneValue,
        };
        try {
            props.step
                ? await axiosInstance.patch(`${url}/${props.step.id!}`, reqBody)
                : await axiosInstance.post(`${url}`, reqBody);
            setShowLoading(false);
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
        possibiliLavoroTypes.filter((el) => el !== "APERTO");

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                {!props.step && (
                    <FormSelect
                        title="Status"
                        value={status}
                        function={changeLavoroType}
                        type={"status"}
                        possibleValues={getPossibleStatusValues()}
                    />
                )}
                <TextArea
                    title="Descrizione Aggiornamento"
                    inputValue={inputDescrizioneValue}
                    inputIsInvalid={inputDescrizioneIsInvalid}
                    inputChangeHandler={inputDescrizioneChangedHandler}
                    inputTouchHandler={inputDescrizioneTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputDescrizioneReset}
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
