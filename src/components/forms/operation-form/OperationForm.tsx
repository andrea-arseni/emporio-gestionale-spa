import {
    IonList,
    IonButton,
    useIonAlert,
    IonLoading,
    IonIcon,
    IonItem,
    IonLabel,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Operazione } from "../../../entities/operazione.model";
import useDateHandler from "../../../hooks/use-date-handler";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import { getDayName } from "../../../utils/timeUtils";
import DatePicker from "../../date-picker/DatePicker";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormInput from "../../form-components/form-input/FormInput";

const FormOperation: React.FC<{
    operation: Operazione | null;
    setMode: Dispatch<SetStateAction<"form" | "list">>;
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
        () => true,
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

    const [presentAlert] = useIonAlert();

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
        !inputDateValue ||
        !inputDescrizioneValue ||
        !inputImportoValue;

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
                <FormInput
                    title="Importo in €"
                    inputValue={inputImportoValue}
                    type={"number"}
                    inputIsInvalid={inputImportoIsInvalid}
                    inputChangeHandler={inputImportoChangedHandler}
                    inputTouchHandler={inputImportoTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputImportoReset}
                />
                <ItemSelector
                    titoloGruppo={"Data"}
                    titoloBottone={"Seleziona Data"}
                    isItemPresent={!!inputDateValue}
                    getItem={() => getDate()}
                    openSelector={() => setDatePickerIsOpen(true)}
                    simple
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
                    {`${
                        props.operation ? "Modifica " : "Crea nuova "
                    } operazione`}
                </IonButton>
            </IonList>
        </form>
    );
};

export default FormOperation;
