import { IonButton, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import { User } from "../../../entities/user.model";
import useInput from "../../../hooks/use-input";
import useList from "../../../hooks/use-list";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
import FormInput from "../../form-components/form-input/FormInput";
import FormSelect from "../../form-components/form-select/FormSelect";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import SecondaryItem from "../../form-components/secondary-item/SecondaryItem";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import Modal from "../../modal/Modal";
import Selector from "../../selector/Selector";
import { closeOutline } from "ionicons/icons";
import { getDayName, getPossibleTimeValues } from "../../../utils/timeUtils";
import useDateHandler from "../../../hooks/use-date-handler";
import DatePicker from "../../date-picker/DatePicker";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { changeLoading } from "../../../store/ui-slice";
import { setModalOpened } from "../../../store/ui-slice";
import { isNativeApp, saveContact } from "../../../utils/contactUtils";
import styles from "./VisitForm.module.css";
import { useNavigate } from "react-router-dom";
import { navigateToSpecificItem } from "../../../utils/navUtils";
import { Evento } from "../../../entities/evento.model";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";
import { setCurrentVisit } from "../../../store/appuntamenti-slice";

const FormVisit: React.FC<{
    readonly?: boolean;
    operationComplete?: () => void;
}> = (props) => {
    const navigate = useNavigate();

    const visit = useAppSelector((state) => state.appuntamenti.currentVisit);

    const dispatch = useAppDispatch();

    const ionSelectAgente = useRef<HTMLIonSelectElement>(null);
    const ionSelectOrario = useRef<HTMLIonSelectElement>(null);

    const {
        hasBeenClicked,
        setHasBeenClicked,
        closeIonSelects,
        isFocusOnTextArea,
        activateTextAreaFocus,
        deactivateTextAreaFocus,
    } = useSingleClick();

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const operationComplete = props.operationComplete;

    const closeTheJob = useCallback(() => {
        if (operationComplete) operationComplete();
        setTimeout(() => {
            hideAlert();
        }, 50);
    }, [operationComplete, hideAlert]);

    const [isQuerySuccessfull, setIsQuerySuccessfull] =
        useState<boolean>(false);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [modalContentType, setModalContentType] = useState<
        "persona" | "immobile" | null
    >(null);

    const apriSelezione = (type: "persona" | "immobile") => {
        setModalContentType(type);
        setModalIsOpen(true);
    };

    const [personaValue, setPersonaValue] = useState<Persona | null>(
        visit && visit.persona ? visit.persona : null
    );

    const [immobileValue, setImmobileValue] = useState<Immobile | null>(
        visit && visit.immobile ? visit.immobile : null
    );

    const {
        datePickerIsOpen,
        setDatePickerIsOpen,
        inputDateValue,
        inputDateChangedHandler,
        inputDateReset,
    } = useDateHandler(
        (el) => !!el,
        visit && visit.quando ? visit.quando : null
    );

    const {
        inputValue: inputTimeValue,
        inputChangedHandler: inputTimeChangedHandler,
    } = useInput(
        () => true,
        visit && visit.quando
            ? visit.quando.split("T")[1].substring(0, 5)
            : null
    );

    const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

    const [possibleUsers, setPossibleUsers] = useState<User[]>([]);

    const {
        inputValue: inputUserValue,
        inputIsInvalid: inputUserIsInvalid,
        inputTouchedHandler: inputUserTouchedHandler,
        inputChangedHandler: inputUserChangedHandler,
        reset: inputUserReset,
    } = useInput(
        () => true,
        visit && visit.user ? capitalize(visit.user.name!) : null
    );

    const {
        inputValue: inputDoveValue,
        inputIsInvalid: inputDoveIsInvalid,
        inputTouchedHandler: inputDoveTouchedHandler,
        inputChangedHandler: inputDoveChangedHandler,
        reset: inputDoveReset,
    } = useInput(() => true, visit && visit.dove ? visit.dove : null);

    const {
        inputValue: inputNoteValue,
        inputChangedHandler: inputNoteChangedHandler,
        inputTouchedHandler: inputNoteTouchedHandler,
        reset: inputNoteReset,
    } = useInput(() => true, visit && visit.note ? visit.note : null);

    const noteTouchHandler = () => {
        inputNoteTouchedHandler();
        deactivateTextAreaFocus();
    };

    const { list: immobileItemsList, closeItemsList: closeImmobileItemsList } =
        useList();

    const { list: personeItemsList, closeItemsList: closePersoneItemsList } =
        useList();

    useEffect(() => {
        const closeModal = () => {
            setModalIsOpen(false);
            setModalContentType(null);
            setCurrentEntity(null);
        };

        if (!currentEntity) return;

        if (modalContentType === "persona") {
            setPersonaValue(currentEntity as Persona);
            closeModal();
        } else {
            setImmobileValue(currentEntity as Immobile);
            closeModal();
        }
    }, [currentEntity, modalContentType]);

    useEffect(() => {
        let mounted = true;

        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get("/users");
                if (!mounted) return;
                setPossibleUsers(res.data.data);
            } catch (e) {
                if (!mounted) return;
                errorHandler(e, "Selezione agente non disponibile");
            }
        };

        fetchUsers();

        return () => {
            mounted = false;
        };
    }, [presentAlert, errorHandler]);

    useEffect(() => {
        let mounted = true;

        const sortEventsByDate = (events: Evento[]) =>
            events.sort(
                (a, b) =>
                    new Date(b.data!).getTime() - new Date(a.data!).getTime()
            );

        const getLastInterestedHouseEvent = (events: Evento[]) =>
            events.find((el) => el.immobile);

        const retrieveEvents = async (id: number) => {
            try {
                const res = await axiosInstance.get(`/persone/${id}/eventi`);
                if (!mounted) return;
                const events: Evento[] = res.data.data;
                sortEventsByDate(events);
                const lastInterestedHouseEvent =
                    getLastInterestedHouseEvent(events);
                const lastInterestedHouse = lastInterestedHouseEvent
                    ? lastInterestedHouseEvent.immobile
                    : null;
                if (lastInterestedHouse) setImmobileValue(lastInterestedHouse);
            } catch (e) {
                if (!mounted) return;
                return null;
            }
        };
        if (personaValue && !visit?.id) {
            retrieveEvents(personaValue.id!);
        }
        return () => {
            mounted = false;
        };
    }, [personaValue, visit]);

    const eseguiForm = useCallback(async () => {
        const mode = visit && visit.id ? "update" : "insert";
        dispatch(changeLoading(true));
        const quando =
            inputDateValue.split("T")[0] + "T" + inputTimeValue + ":00";

        const reqBody = {
            quando,
            idPersona: personaValue
                ? personaValue.id
                : mode === "update"
                ? 0
                : null,
            idImmobile: immobileValue
                ? immobileValue.id
                : mode === "update"
                ? 0
                : null,
            userName: inputUserValue,
            dove: inputDoveValue,
            note: inputNoteValue,
        };

        try {
            let res = null;
            if (mode === "update") {
                res = await axiosInstance.patch(
                    `/visite/${visit!.id}`,
                    reqBody
                );
            } else {
                res = await axiosInstance.post("/visite", reqBody);
            }
            dispatch(changeLoading(false));
            setIsQuerySuccessfull(true);
            dispatch(setCurrentVisit(res.data));

            presentAlert({
                header: "Ottimo!",
                message:
                    visit && visit.id ? `Visita modificata` : `Visita aggiunta`,
                buttons: [
                    {
                        text: "Ok",
                        handler: closeTheJob,
                    },
                ],
            });
        } catch (error: any) {
            dispatch(changeLoading(false));
            errorHandler(
                error,
                `${
                    mode === "update" ? "Aggiornamento" : "Inserimento"
                } visita non riuscito`
            );
        }
    }, [
        dispatch,
        errorHandler,
        closeTheJob,
        presentAlert,
        immobileValue,
        inputDateValue,
        inputDoveValue,
        inputNoteValue,
        inputTimeValue,
        inputUserValue,
        personaValue,
        visit,
    ]);

    const submitVisit = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    useEffect(() => {
        const isFormDisabled =
            !inputDateValue ||
            !inputTimeValue ||
            !inputUserValue ||
            (immobileValue && !personaValue) ||
            (!personaValue &&
                !immobileValue &&
                !inputDoveValue &&
                !inputNoteValue);

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (
                !props.readonly &&
                !isFormDisabled &&
                !isError &&
                e.key === "Enter" &&
                !isFocusOnTextArea
            ) {
                setHasBeenClicked(true);
                closeIonSelects([ionSelectAgente, ionSelectOrario]);
                if (isQuerySuccessfull) {
                    closeTheJob();
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
        dispatch,
        errorHandler,
        eseguiForm,
        closeTheJob,
        setHasBeenClicked,
        closeIonSelects,
        isFocusOnTextArea,
        hasBeenClicked,
        isQuerySuccessfull,
        isError,
        immobileValue,
        inputDateValue,
        inputDoveValue,
        inputNoteValue,
        inputTimeValue,
        inputUserValue,
        personaValue,
        props.readonly,
        visit,
    ]);

    const isFormDisabled =
        !inputDateValue ||
        !inputTimeValue ||
        !inputUserValue ||
        (immobileValue && !personaValue) ||
        (!personaValue && !immobileValue && !inputDoveValue && !inputNoteValue);

    const getSubmitText = () => {
        if (!inputDateValue) return "Data obbligatoria";
        if (!inputTimeValue) return "Orario obbligatorio";
        if (!inputUserValue) return "Incaricato obbligatorio";
        if (immobileValue && !personaValue) return "Persona obbligatoria";
        if (
            !personaValue &&
            !immobileValue &&
            !inputDoveValue &&
            !inputNoteValue
        )
            return "Dati insufficienti";
        return `${visit && visit.id ? "Modifica " : "Aggiungi "}
                            Visita`;
    };

    const getImmobile = () => {
        const immobileData = (
            <IonLabel text-wrap>
                <p>Riferimento {immobileValue!.ref}</p>
                <h3>{immobileValue!.titolo}</h3>
                <p>{`${immobileValue!.indirizzo} (${
                    immobileValue!.comune
                })`}</p>
            </IonLabel>
        );

        return (
            <IonList
                style={{ padding: "0", margin: "0" }}
                ref={immobileItemsList}
            >
                <SecondaryItem
                    directDeleting
                    key={immobileValue!.id}
                    visualizeAction={async () => {
                        dispatch(setModalOpened(false));
                        await new Promise((r) => setTimeout(r, 400));
                        navigateToSpecificItem(
                            "immobili",
                            immobileValue!.id!.toString(),
                            navigate
                        );
                    }}
                    deleteAction={
                        props.readonly
                            ? undefined
                            : () => setImmobileValue(null)
                    }
                    closeItems={closeImmobileItemsList}
                >
                    {immobileData}
                </SecondaryItem>
            </IonList>
        );
    };

    const getPersona = () => {
        const personaData = (
            <IonLabel text-wrap>
                <h2>{capitalize(personaValue!.nome!)}</h2>
                <h3>
                    {!personaValue!.telefono && "Telefono mancante"}
                    {personaValue!.telefono && (
                        <a href={`tel:${personaValue!.telefono}`}>
                            {personaValue!.telefono}
                        </a>
                    )}
                </h3>
                <h3>
                    {!personaValue!.email && "Email mancante"}
                    {personaValue!.email && (
                        <a href={`mailto:${personaValue!.email}`}>
                            {personaValue!.email}
                        </a>
                    )}
                </h3>
            </IonLabel>
        );
        return (
            <IonList
                style={{ padding: "0", margin: "0" }}
                ref={personeItemsList}
            >
                <SecondaryItem
                    directDeleting
                    visualizeAction={async () => {
                        dispatch(setModalOpened(false));
                        await new Promise((r) => setTimeout(r, 400));
                        navigateToSpecificItem(
                            "persone",
                            personaValue!.id!.toString(),
                            navigate
                        );
                    }}
                    addAction={
                        isNativeApp
                            ? () =>
                                  saveContact(
                                      presentAlert,
                                      personaValue!,
                                      errorHandler
                                  )
                            : undefined
                    }
                    closeItems={closePersoneItemsList}
                    deleteAction={
                        props.readonly ? undefined : () => setPersonaValue(null)
                    }
                >
                    {personaData}
                </SecondaryItem>
            </IonList>
        );
    };

    const getDate = () => (
        <IonItem>
            <IonLabel text-wrap>
                {getDayName(new Date(inputDateValue), "long")}
            </IonLabel>
            {!props.readonly && (
                <IonIcon
                    slot="end"
                    icon={closeOutline}
                    onClick={() => inputDateReset()}
                ></IonIcon>
            )}
        </IonItem>
    );

    return (
        <form className="form">
            <IonList className="list">
                <ItemSelector
                    strict={props.readonly}
                    titoloGruppo={"Data della Visita"}
                    titoloBottone={"Seleziona Data"}
                    isItemPresent={!!inputDateValue}
                    getItem={() => getDate()}
                    openSelector={() => setDatePickerIsOpen(true)}
                />
                <div
                    style={{
                        borderRight: "1px solid gray",
                        borderLeft: "1px solid gray",
                    }}
                >
                    {!props.readonly && (
                        <FormSelect
                            ref={ionSelectOrario}
                            title="Orario della Visita"
                            value={inputTimeValue}
                            function={inputTimeChangedHandler}
                            possibleValues={getPossibleTimeValues()}
                        />
                    )}
                    {props.readonly && (
                        <p
                            className={styles.staticHours}
                        >{`Orario della Visita: ${inputTimeValue}`}</p>
                    )}
                </div>
                <ItemSelector
                    strict={props.readonly}
                    titoloGruppo="Persona"
                    titoloBottone={
                        props.readonly
                            ? "Persona non presente"
                            : "Aggiungi Persona"
                    }
                    isItemPresent={!!personaValue}
                    getItem={() => getPersona()}
                    openSelector={
                        props.readonly
                            ? () => {}
                            : () => apriSelezione("persona")
                    }
                />
                <ItemSelector
                    strict={props.readonly}
                    titoloGruppo="Immobile"
                    titoloBottone={
                        props.readonly
                            ? "Immobile non presente"
                            : "Aggiungi Immobile"
                    }
                    isItemPresent={!!immobileValue}
                    getItem={() => getImmobile()}
                    openSelector={
                        props.readonly
                            ? () => {}
                            : () => apriSelezione("immobile")
                    }
                />
                {possibleUsers.length > 0 && !props.readonly && (
                    <FormSelect
                        ref={ionSelectAgente}
                        title="Agente Incaricato"
                        value={inputUserValue}
                        function={inputUserChangedHandler}
                        possibleValues={possibleUsers.map((el) => el.name!)}
                    />
                )}
                {props.readonly && (
                    <FormInput
                        readonly={props.readonly}
                        title={"Agente Incaricato"}
                        inputValue={
                            inputUserValue ? inputUserValue : "Non indicato"
                        }
                        type={"text"}
                        inputIsInvalid={inputUserIsInvalid}
                        inputChangeHandler={inputUserChangedHandler}
                        inputTouchHandler={inputUserTouchedHandler}
                        errorMessage={""}
                        reset={() => inputUserReset()}
                    />
                )}
                <FormInput
                    readonly={props.readonly}
                    title={"Dove"}
                    inputValue={inputDoveValue}
                    type={"text"}
                    inputIsInvalid={inputDoveIsInvalid}
                    inputChangeHandler={inputDoveChangedHandler}
                    inputTouchHandler={inputDoveTouchedHandler}
                    errorMessage={""}
                    reset={() => inputDoveReset()}
                />
                <TextArea
                    readonly={props.readonly}
                    title={`Note`}
                    inputValue={inputNoteValue}
                    inputChangeHandler={inputNoteChangedHandler}
                    inputTouchHandler={noteTouchHandler}
                    focusHandler={activateTextAreaFocus}
                    reset={inputNoteReset}
                />
                {!props.readonly && (
                    <IonButton
                        onKeyDown={(e) => e.preventDefault()}
                        expand="block"
                        disabled={isFormDisabled}
                        onClick={(e) => submitVisit(e)}
                    >
                        {getSubmitText()}
                    </IonButton>
                )}
            </IonList>
            <Modal
                setIsOpen={setModalIsOpen}
                isOpen={modalIsOpen}
                title={`Scegli ${modalContentType} della visita`}
                handler={() => setModalIsOpen(false)}
            >
                {modalContentType && (
                    <Selector
                        entitiesType={
                            modalContentType === "persona"
                                ? "persone"
                                : "immobili"
                        }
                        setCurrentEntity={setCurrentEntity}
                        selectMode
                        localQuery
                    />
                )}
            </Modal>
            {datePickerIsOpen && (
                <DatePicker
                    closePicker={() => setDatePickerIsOpen(false)}
                    minValue={new Date().toISOString()}
                    maxValue="2040-05-31T23:59:59"
                    changeHandler={inputDateChangedHandler}
                    value={inputDateValue}
                    sundayDisabled
                />
            )}
        </form>
    );
};

export default FormVisit;
