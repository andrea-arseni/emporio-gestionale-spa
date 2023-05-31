import {
    IonItem,
    IonLabel,
    IonIcon,
    IonLoading,
    IonList,
    IonSelect,
    IonSelectOption,
    IonButton,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useState, useEffect, FormEvent, useCallback, useRef } from "react";
import { Entity } from "../../../entities/entity";
import { Evento } from "../../../entities/evento.model";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useInput from "../../../hooks/use-input";
import { possibiliPersoneTypes } from "../../../types/persona_types";
import axiosInstance from "../../../utils/axiosInstance";
import DatePicker from "../../date-picker/DatePicker";
import FormInputBoolean from "../../form-components/form-input-boolean/FormInputBoolean";
import FormInput from "../../form-components/form-input/FormInput";
import Modal from "../../modal/Modal";
import Selector from "../../selector/Selector";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import { getDayName, getPossibleTimeValues } from "../../../utils/timeUtils";
import useDateHandler from "../../../hooks/use-date-handler";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormGroup from "../../form-components/form-group/FormGroup";
import FormSelect from "../../form-components/form-select/FormSelect";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";

const EventoForm: React.FC<{
    persona: Persona;
    evento: Evento | null;
    backToList: () => void;
}> = (props) => {
    let statusChangedDescription: string | null = null;
    let eventDescription =
        props.evento && props.evento.descrizione
            ? props.evento.descrizione
            : null;

    if (
        props.evento &&
        props.evento.descrizione &&
        props.evento.descrizione.indexOf("[") === 0 &&
        props.evento.descrizione.includes("]")
    ) {
        statusChangedDescription = props.evento.descrizione
            .substring(1)
            .split("]")[0]
            .trim();
        eventDescription = props.evento.descrizione.split("]")[1].trim();
    }

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [nameUpdated, isNameUpdated] = useState<boolean>(false);

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const [isVisit, setIsVisit] = useState<boolean>(false);

    const ionSelectStatus = useRef<HTMLIonSelectElement>(null);
    const ionSelectOrario = useRef<HTMLIonSelectElement>(null);

    const {
        hasBeenClicked,
        setHasBeenClicked,
        closeIonSelects,
        isFocusOnTextArea,
        activateTextAreaFocus,
        deactivateTextAreaFocus,
    } = useSingleClick();

    const {
        datePickerIsOpen,
        setDatePickerIsOpen,
        inputDateValue,
        inputDateChangedHandler,
        inputDateReset,
    } = useDateHandler((el) => !!el, null);

    const {
        inputValue: inputTimeValue,
        inputChangedHandler: inputTimeChangedHandler,
    } = useInput(() => true, null);

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
        inputIsTouched: inputStatusIsTouched,
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
        inputIsInvalid: inputNoteIsInvalid,
        reset: inputNoteReset,
    } = useInput(() => true, eventDescription);

    const touchDescrizioneHandler = () => {
        inputNoteTouchedHandler();
        deactivateTextAreaFocus();
    };

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setImmobileInteresse(immobileInteresse);
            setModalIsOpen(false);
        }, 300);
        return () => clearTimeout(timeOut);
    }, [immobileInteresse]);

    useEffect(() => {
        let mounted = true;

        const sortEventsByDate = (events: Evento[]) =>
            events.sort(
                (a, b) =>
                    new Date(b.data!).getTime() - new Date(a.data!).getTime()
            );

        const getLastInterestedHouseEvent = (events: Evento[]) =>
            events.find((el) => el.immobile);

        const retrieveEvents = async () => {
            try {
                const res = await axiosInstance.get(
                    `/persone/${props.persona.id}/eventi`
                );
                if (!mounted) return;
                const events: Evento[] = res.data.data;
                sortEventsByDate(events);
                const lastInterestedHouseEvent =
                    getLastInterestedHouseEvent(events);
                const lastInterestedHouse = lastInterestedHouseEvent
                    ? lastInterestedHouseEvent.immobile
                    : null;
                if (lastInterestedHouse)
                    setImmobileInteresse(lastInterestedHouse);
            } catch (e) {
                if (!mounted) return;
                return null;
            }
        };

        retrieveEvents();

        return () => {
            mounted = false;
        };
    }, [props.persona.id]);

    const getMessage = useCallback(
        () => `${isVisit ? "Visita Fissata" : "Persona Aggiornata"}`,
        [isVisit]
    );

    const getDescrizioneCompleta = statusChangedDescription
        ? "[" + statusChangedDescription + "] " + inputNoteValue
        : inputNoteValue;

    const isFormInvalid =
        (props.evento && !inputNoteIsTouched) ||
        (isVisit && (!inputDateValue || !inputTimeValue)) ||
        (!isVisit &&
            !inputStatusIsTouched &&
            (!inputNoteValue || inputNoteValue.toString().trim().length === 0));

    const getSubmitText = () => {
        if (props.evento && !inputNoteIsTouched) return "Note è obbligatorio";
        if (
            !isVisit &&
            !inputStatusIsTouched &&
            (!inputNoteValue || inputNoteValue.toString().trim().length === 0)
        )
            return "Cambiare Note o Status";
        if (isVisit && !inputDateValue) return "Data obbligatoria";
        if (isVisit && !inputTimeValue) return "Orario obbligatorio";

        return props.evento
            ? "Aggiorna Evento"
            : isVisit
            ? "Fissa Visita"
            : "Aggiorna Persona";
    };

    const eseguiForm = useCallback(async () => {
        setShowLoading(true);
        try {
            let reqBody = null;
            if (props.evento) {
                reqBody = {
                    descrizione: getDescrizioneCompleta.trim(),
                };
                await axiosInstance.patch(
                    `/persone/${props.persona.id}/eventi/${props.evento.id}`,
                    reqBody
                );
            } else if (isVisit) {
                reqBody = {
                    quando: `${
                        inputDateValue.split("T")[0]
                    }T${inputTimeValue}:00`,
                    idPersona: props.persona.id,
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
                    `/persone/${props.persona.id}/eventi`,
                    reqBody
                );
            }
            setShowLoading(false);
            isNameUpdated(true);
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
            errorHandler(error, "Procedura non riuscita");
        }
    }, [
        errorHandler,
        getDescrizioneCompleta,
        getMessage,
        immobileInteresse?.id,
        inputDateValue,
        inputLuogoValue,
        inputNoteValue,
        inputStatusValue,
        inputTimeValue,
        isVisit,
        presentAlert,
        props,
    ]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    useEffect(() => {
        const isFormInvalid =
            (isVisit && (!inputDateValue || !inputTimeValue)) ||
            (!isVisit &&
                !inputStatusIsTouched &&
                (!inputNoteValue ||
                    inputNoteValue.toString().trim().length === 0));

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (
                e.key === "Enter" &&
                !isError &&
                !isFormInvalid &&
                !isFocusOnTextArea
            ) {
                setHasBeenClicked(true);
                closeIonSelects([ionSelectStatus, ionSelectOrario]);
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
        closeIonSelects,
        props,
        isFocusOnTextArea,
        nameUpdated,
        getDescrizioneCompleta,
        immobileInteresse?.id,
        inputDateValue,
        inputLuogoValue,
        inputNoteValue,
        inputStatusIsTouched,
        inputStatusValue,
        inputTimeValue,
        isVisit,
        errorHandler,
        isError,
        hasBeenClicked,
        eseguiForm,
        setHasBeenClicked,
    ]);

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

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                {!props.evento && (
                    <FormGroup title="Dati Base">
                        {!isVisit && (
                            <IonItem>
                                <IonLabel
                                    position="floating"
                                    color={
                                        inputStatusIsInvalid ? "danger" : "dark"
                                    }
                                >
                                    Status Persona
                                </IonLabel>
                                <IonSelect
                                    ref={ionSelectStatus}
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
                        <FormInputBoolean
                            condition={isVisit}
                            setCondition={setIsVisit}
                            sentence={"E' una visita"}
                        />
                    </FormGroup>
                )}
                {!props.evento && (
                    <ItemSelector
                        titoloGruppo={"Immobile d'Interesse"}
                        titoloBottone={"Aggiungi Casa d'Interesse"}
                        isItemPresent={!!immobileInteresse}
                        getItem={() =>
                            getImmobile(immobileInteresse as Immobile)
                        }
                        openSelector={() => setModalIsOpen(true)}
                    />
                )}
                {isVisit && !props.evento && (
                    <ItemSelector
                        titoloGruppo={"Data della Visita"}
                        titoloBottone={"Seleziona Data"}
                        isItemPresent={!!inputDateValue}
                        getItem={() => getDate()}
                        openSelector={() => setDatePickerIsOpen(true)}
                    />
                )}
                {isVisit && !props.evento && (
                    <div
                        style={{
                            borderRight: "1px solid gray",
                            borderLeft: "1px solid gray",
                        }}
                    >
                        <FormSelect
                            ref={ionSelectOrario}
                            title="Orario della Visita"
                            value={inputTimeValue}
                            function={inputTimeChangedHandler}
                            possibleValues={getPossibleTimeValues()}
                        />
                    </div>
                )}
                {!props.evento && (
                    <FormGroup title="Dati opzionali">
                        {isVisit && (
                            <FormInput
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
                        <TextArea
                            title="Descrizione"
                            autofocus
                            inputValue={inputNoteValue}
                            inputIsInvalid={inputNoteIsInvalid}
                            inputChangeHandler={inputNoteChangedHandler}
                            inputTouchHandler={touchDescrizioneHandler}
                            focusHandler={activateTextAreaFocus}
                            errorMessage={"Input non valido"}
                            reset={inputNoteReset}
                        />
                    </FormGroup>
                )}
                {props.evento && (
                    <TextArea
                        title="Descrizione"
                        autofocus
                        inputValue={inputNoteValue}
                        inputIsInvalid={inputNoteIsInvalid}
                        inputChangeHandler={inputNoteChangedHandler}
                        inputTouchHandler={touchDescrizioneHandler}
                        focusHandler={activateTextAreaFocus}
                        errorMessage={"Input non valido"}
                        reset={inputNoteReset}
                    />
                )}
                <IonButton
                    expand="block"
                    disabled={isFormInvalid}
                    onClick={(e) => submitForm(e)}
                >
                    {getSubmitText()}
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
                    localQuery
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
