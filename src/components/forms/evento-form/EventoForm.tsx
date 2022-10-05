import {
    useIonAlert,
    IonItem,
    IonLabel,
    IonIcon,
    IonLoading,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    useIonPicker,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useState, useEffect, FormEvent } from "react";
import { Entity } from "../../../entities/entity";
import { Evento } from "../../../entities/evento.model";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useInput from "../../../hooks/use-input";
import useQueryData from "../../../hooks/use-query-data";
import { possibiliPersoneTypes } from "../../../types/persona_types";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import DatePicker from "../../date-picker/DatePicker";
import FormInputBoolean from "../../form-components/form-input-boolean/FormInputBoolean";
import TextInput from "../../form-components/text_input/TextInput";
import Modal from "../../modal/Modal";
import Selector from "../../selector/Selector";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import { getDayName, openTimePicker } from "../../../utils/timeUtils";
import useDateHandler from "../../../hooks/use-date-handler";

const EventoForm: React.FC<{
    persona: Persona | null;
    evento: Evento | null;
    backToList: () => void;
}> = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const [isVisit, setIsVisit] = useState<boolean>(false);

    const [present] = useIonPicker();

    const {
        datePickerIsOpen,
        setDatePickerIsOpen,
        inputDateValue,
        inputDateChangedHandler,
        inputDateReset,
    } = useDateHandler((el) => !!el, null);

    const [timeValue, setTimeValue] = useState<string | null>(null);

    const {
        inputValue: inputLuogoValue,
        inputIsInvalid: inputLuogoIsInvalid,
        inputTouchedHandler: inputLuogoTouchedHandler,
        inputChangedHandler: inputLuogoChangedHandler,
        reset: inputLuogoReset,
    } = useInput(() => true);

    const [immobileInteresse, setImmobileInteresse] = useState<Entity | null>(
        null
    );

    const {
        inputValue: inputStatusValue,
        inputIsInvalid: inputStatusIsInvalid,
        inputTouchedHandler: inputStatusTouchedHandler,
        inputChangedHandler: inputStatusChangedHandler,
    } = useInput(
        (el) => el.toString().length > 0,
        props.persona && props.persona.status
            ? props.persona.status.toUpperCase().replace(" ", "_")
            : null
    );

    const {
        inputValue: inputNoteValue,
        inputIsTouched: inputNoteIsTouched,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
    } = useInput(() => true, props.evento ? props.evento.descrizione : null);

    const queryData = useQueryData("eventi");

    useEffect(() => {
        setTimeout(() => {
            setImmobileInteresse(immobileInteresse);
            setModalIsOpen(false);
        }, 300);
    }, [immobileInteresse]);

    const getMessage = () =>
        `${isVisit ? "Visita Fissata" : "Persona Aggiornata"}`;

    const isFormInvalid =
        (props.evento && !inputNoteIsTouched) ||
        (isVisit && (!inputDateValue || !timeValue)) ||
        (!isVisit &&
            (!inputNoteValue || inputNoteValue.toString().trim().length === 0));

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        try {
            let reqBody = null;
            if (props.evento) {
                reqBody = {
                    descrizione: inputNoteValue.trim(),
                };
                await axiosInstance.patch(
                    `/persone/${props.persona!.id}/eventi/${props.evento.id}`,
                    reqBody
                );
            } else if (isVisit) {
                reqBody = {
                    quando: `${inputDateValue.split("T")[0]}T${timeValue}:00`,
                    idPersona: props.persona?.id,
                    note: inputNoteValue.trim(),
                    idImmobile: immobileInteresse?.id,
                    dove: inputLuogoValue,
                };
                await axiosInstance.post(`/visite`, reqBody);
            } else {
                reqBody = {
                    descrizione: inputNoteValue.trim(),
                    statusPersona: inputStatusValue
                        .toUpperCase()
                        .replace(" ", "_"),
                    idImmobile: immobileInteresse?.id,
                };
                await axiosInstance.post(
                    `/persone/${props.persona?.id}/eventi`,
                    reqBody
                );
            }
            setShowLoading(false);
            presentAlert({
                header: "Ottimo",
                subHeader: getMessage(),
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

    const getImmobile = (immobile: Immobile) => {
        return (
            <IonItem key={immobile!.id}>
                <IonLabel text-wrap>
                    <h3>Riferimento {immobile!.ref}</h3>
                    <p>{immobile!.titolo}</p>
                </IonLabel>
                <IonIcon
                    slot="end"
                    icon={closeOutline}
                    onClick={() => setImmobileInteresse(null)}
                ></IonIcon>
            </IonItem>
        );
    };

    const getData = () => (
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

    const getTime = () => (
        <IonItem>
            <IonLabel text-wrap>{timeValue}</IonLabel>
            <IonIcon
                slot="end"
                icon={closeOutline}
                onClick={() => setTimeValue(null)}
            ></IonIcon>
        </IonItem>
    );

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                {!isVisit && !props.evento && (
                    <IonItem>
                        <IonLabel
                            position="floating"
                            color={inputStatusIsInvalid ? "danger" : "dark"}
                        >
                            Status Persona
                        </IonLabel>
                        <IonSelect
                            cancelText="Torna Indietro"
                            mode="ios"
                            interface="action-sheet"
                            value={inputStatusValue}
                            onIonChange={inputStatusChangedHandler}
                            onIonBlur={inputStatusTouchedHandler}
                        >
                            {possibiliPersoneTypes.map((el) => {
                                return (
                                    <IonSelectOption
                                        key={el.value}
                                        value={el.value.toUpperCase()}
                                    >
                                        {el.text}
                                    </IonSelectOption>
                                );
                            })}
                        </IonSelect>
                    </IonItem>
                )}
                {!props.evento && (
                    <FormInputBoolean
                        condition={isVisit}
                        setCondition={setIsVisit}
                        sentence={"E' una visita"}
                    />
                )}
                {!props.evento && (
                    <ItemSelector
                        titoloGruppo={"Immobile d'Interesse"}
                        titoloBottone={"Aggiungi Casa d'Interesse"}
                        item={immobileInteresse!}
                        getItem={getImmobile}
                        openSelector={() => setModalIsOpen(true)}
                    />
                )}
                {isVisit && !props.evento && (
                    <ItemSelector
                        titoloGruppo={"Data della Visita"}
                        titoloBottone={"Seleziona Data"}
                        item={inputDateValue}
                        getItem={getData}
                        openSelector={() => setDatePickerIsOpen(true)}
                    />
                )}
                {isVisit && !props.evento && (
                    <ItemSelector
                        titoloGruppo={"Orario della Visita"}
                        titoloBottone={"Seleziona Orario"}
                        item={timeValue}
                        getItem={getTime}
                        openSelector={() =>
                            openTimePicker(setTimeValue, present)
                        }
                    />
                )}
                {isVisit && !props.evento && (
                    <TextInput
                        title={"Dove"}
                        inputValue={inputLuogoValue}
                        type={"text"}
                        inputIsInvalid={inputLuogoIsInvalid}
                        inputChangeHandler={inputLuogoChangedHandler}
                        inputTouchHandler={inputLuogoTouchedHandler}
                        errorMessage={"Luogo non valido"}
                        reset={inputLuogoReset}
                    />
                )}
                <IonItem>
                    <IonLabel position="floating">Note</IonLabel>
                    <IonTextarea
                        auto-grow
                        rows={6}
                        value={inputNoteValue}
                        onIonChange={(e) => inputNoteChangedHandler(e)}
                        onIonBlur={() => inputNoteTouchedHandler()}
                    ></IonTextarea>
                </IonItem>
                <IonButton
                    expand="block"
                    disabled={isFormInvalid}
                    onClick={(e) => submitForm(e)}
                >
                    {props.evento
                        ? "Aggiorna Evento"
                        : isVisit
                        ? "Fissa Visita"
                        : "Aggiorna Persona"}
                </IonButton>
            </IonList>
            <Modal
                setIsOpen={setModalIsOpen}
                isOpen={modalIsOpen}
                title={`Scegli immobile d'interesse`}
                handler={() => setModalIsOpen(false)}
            >
                <Selector
                    entitiesType="immobili"
                    setCurrentEntity={setImmobileInteresse}
                    selectMode
                    queryData={queryData}
                />
            </Modal>
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
        </form>
    );
};

export default EventoForm;
