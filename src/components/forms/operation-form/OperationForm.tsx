import {
    IonList,
    IonButton,
    IonLoading,
    IonIcon,
    IonItem,
    IonLabel,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { FormEvent, useEffect, useState } from "react";
import { Operazione } from "../../../entities/operazione.model";
import useDateHandler from "../../../hooks/use-date-handler";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import { getDayName } from "../../../utils/timeUtils";
import DatePicker from "../../date-picker/DatePicker";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormInput from "../../form-components/form-input/FormInput";
import useErrorHandler from "../../../hooks/use-error-handler";

const FormOperation: React.FC<{
    operation: Operazione | null;
    backToList: () => void;
}> = (props) => {
    const {
        datePickerIsOpen,
        setDatePickerIsOpen,
        inputDateValue,
        inputDateChangedHandler,
        inputDateReset,
    } = useDateHandler(
        (el) => !!el,
        props.operation && props.operation.data ? props.operation.data : null
    );

    const {
        inputValue: inputImportoValue,
        inputIsInvalid: inputImportoIsInvalid,
        inputIsTouched: inputImportoIsTouched,
        inputTouchedHandler: inputImportoTouchedHandler,
        inputChangedHandler: inputImportoChangedHandler,
        reset: inputImportoReset,
    } = useInput(
        (el) => +el % 1 === 0 && +el !== 0,
        props.operation && props.operation.importo !== undefined
            ? props.operation.importo
            : null
    );

    const {
        inputValue: inputDescrizioneValue,
        inputIsInvalid: inputDescrizioneIsInvalid,
        inputIsTouched: inputDescrizioneIsTouched,
        inputTouchedHandler: inputDescrizioneTouchedHandler,
        inputChangedHandler: inputDescrizioneChangedHandler,
        reset: inputDescrizioneReset,
    } = useInput(
        () => true,
        props.operation && props.operation.descrizione !== undefined
            ? props.operation.descrizione
            : null
    );

    const [nameUpdated, isNameUpdated] = useState<boolean>(false);

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        const reqBody = {
            data: inputDateValue.split("T")[0],
            importo: inputImportoValue,
            descrizione: inputDescrizioneValue,
        };
        try {
            await (props.operation
                ? axiosInstance.patch(
                      "operazioni/" + props.operation.id,
                      reqBody
                  )
                : axiosInstance.post("operazioni", reqBody));
            setShowLoading(false);
            isNameUpdated(true);
            presentAlert({
                header: "Ottimo",
                message: `Operazione ${
                    props.operation ? "modificata" : "creata"
                }`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => props.backToList(),
                    },
                ],
            });
        } catch (e: any) {
            setShowLoading(false);
            errorHandler(e, "Creazione operazione non riuscita");
        }
    };

    const getDate = () => (
        <IonItem>
            <IonLabel text-wrap>
                {getDayName(new Date(inputDateValue), "long")}
            </IonLabel>
            <IonIcon
                slot="end"
                icon={closeOutline}
                onClick={() => inputDateReset()}
            ></IonIcon>
        </IonItem>
    );

    const isFormDisabled =
        (!props.operation &&
            (!inputDescrizioneIsTouched ||
                inputDescrizioneIsInvalid ||
                !inputDateValue ||
                !inputImportoIsTouched ||
                inputImportoIsInvalid)) ||
        (props.operation &&
            !inputDescrizioneIsTouched &&
            !inputImportoIsTouched) ||
        !inputDateValue ||
        !inputDescrizioneValue ||
        !inputImportoValue;

    const getSubmitText = () => {
        if (!inputDateValue) return "Data obbligatoria";
        if (!inputImportoValue) return "Importo obbligatorio";
        if (inputImportoIsInvalid) return "Importo invalido";
        if (!inputDescrizioneValue) return "Descrizione obbligatoria";
        if (inputDescrizioneIsInvalid) return "Descrizione invalida";

        return `${props.operation ? "Modifica " : "Crea nuova "} operazione`;
    };

    useEffect(() => {
        const isFormDisabled =
            (!props.operation &&
                (!inputDescrizioneIsTouched ||
                    inputDescrizioneIsInvalid ||
                    !inputDateValue ||
                    !inputImportoIsTouched ||
                    inputImportoIsInvalid)) ||
            (props.operation &&
                (!inputDateValue ||
                    !inputDescrizioneValue ||
                    !inputImportoValue));

        const eseguiForm = async () => {
            setShowLoading(true);
            const reqBody = {
                data: inputDateValue.split("T")[0],
                importo: inputImportoValue,
                descrizione: inputDescrizioneValue,
            };
            try {
                await (props.operation
                    ? axiosInstance.patch(
                          "operazioni/" + props.operation.id,
                          reqBody
                      )
                    : axiosInstance.post("operazioni", reqBody));
                setShowLoading(false);
                isNameUpdated(true);
                presentAlert({
                    header: "Ottimo",
                    message: `Operazione ${
                        props.operation ? "modificata" : "creata"
                    }`,
                    buttons: [
                        {
                            text: "OK",
                            handler: () => props.backToList(),
                        },
                    ],
                });
            } catch (e: any) {
                setShowLoading(false);
                errorHandler(e, "Creazione operazione non riuscita");
            }
        };

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (!isFormDisabled && e.key === "Enter" && !isError) {
                if (nameUpdated) {
                    hideAlert();
                    props.backToList();
                } else {
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
        isError,
        props,
        nameUpdated,
        inputDescrizioneValue,
        inputDateValue,
        inputDescrizioneIsInvalid,
        inputDescrizioneIsTouched,
        inputImportoIsInvalid,
        inputImportoIsTouched,
        inputImportoValue,
    ]);

    return (
        <form onSubmit={submitForm} className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />

            <IonList className="list">
                {datePickerIsOpen && (
                    <DatePicker
                        closePicker={() => setDatePickerIsOpen(false)}
                        minValue="2019-01-01T00:00:00"
                        maxValue="2040-05-31T23:59:59"
                        changeHandler={inputDateChangedHandler}
                        value={inputDateValue}
                        sundayDisabled
                    />
                )}
                <ItemSelector
                    titoloGruppo={"Data"}
                    titoloBottone={"Seleziona Data"}
                    isItemPresent={!!inputDateValue}
                    getItem={() => getDate()}
                    openSelector={() => setDatePickerIsOpen(true)}
                    simple
                />
                <FormInput
                    autofocus
                    title="Importo in €"
                    inputValue={inputImportoValue}
                    type={"number"}
                    inputIsInvalid={inputImportoIsInvalid}
                    inputChangeHandler={inputImportoChangedHandler}
                    inputTouchHandler={inputImportoTouchedHandler}
                    errorMessage={"Input non valido, solo numeri interi"}
                    reset={inputImportoReset}
                />
                <TextArea
                    title="Descrizione"
                    inputValue={inputDescrizioneValue}
                    inputIsInvalid={inputDescrizioneIsInvalid}
                    inputChangeHandler={inputDescrizioneChangedHandler}
                    inputTouchHandler={inputDescrizioneTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputDescrizioneReset}
                />
                <IonButton
                    expand="full"
                    mode="ios"
                    color="primary"
                    type="submit"
                    disabled={isFormDisabled}
                >
                    {getSubmitText()}
                </IonButton>
            </IonList>
        </form>
    );
};

export default FormOperation;
