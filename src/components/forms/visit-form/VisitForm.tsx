import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    useIonAlert,
} from "@ionic/react";
import { FormEvent, useEffect, useState } from "react";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import { User } from "../../../entities/user.model";
import useInput from "../../../hooks/use-input";
import useList from "../../../hooks/use-list";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
import errorHandler from "../../../utils/errorHandler";
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
import FormTitle from "../../form-components/form-title/FormTitle";
import { backToList } from "../../../store/appuntamenti-slice";
import { setModalOpened } from "../../../store/ui-slice";
import { isNativeApp, saveContact } from "../../../utils/contactUtils";
import styles from "./VisitForm.module.css";
import { useNavigate } from "react-router-dom";
import { navigateToSpecificItem } from "../../../utils/navUtils";

const FormVisit: React.FC<{
    readonly?: boolean;
    operationComplete?: () => void;
}> = (props) => {
    const navigate = useNavigate();

    const visit = useAppSelector((state) => state.appuntamenti.currentVisit);

    const dispatch = useAppDispatch();

    const [presentAlert] = useIonAlert();

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
                errorHandler(
                    e,
                    () => {},
                    "Selezione agente non disponibile",
                    presentAlert
                );
            }
        };

        fetchUsers();

        return () => {
            mounted = false;
        };
    }, [presentAlert]);

    const isFormDisabled =
        !inputDateValue ||
        !inputTimeValue ||
        !inputUserValue ||
        (immobileValue && !personaValue) ||
        (!personaValue && !immobileValue && !inputDoveValue && !inputNoteValue);

    const submitVisit = async (e: FormEvent) => {
        e.preventDefault();
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
            if (mode === "update") {
                await axiosInstance.patch(`/visite/${visit!.id}`, reqBody);
            } else {
                await axiosInstance.post("/visite", reqBody);
            }
            dispatch(changeLoading(false));
            props.operationComplete!();
        } catch (error: any) {
            dispatch(changeLoading(false));
            errorHandler(
                error,
                () => {},
                "Inserimento visita non riuscito",
                presentAlert
            );
        }
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
                            ? () => saveContact(presentAlert, personaValue!)
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
        <>
            {!props.readonly && (
                <FormTitle
                    title={
                        visit && visit.id ? "Modifica Visita" : "Nuova Visita"
                    }
                    handler={() => {
                        dispatch(backToList());
                        dispatch(setModalOpened(false));
                    }}
                    backToList
                />
            )}
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
                        inputTouchHandler={inputNoteTouchedHandler}
                        reset={inputNoteReset}
                    />
                    {!props.readonly && (
                        <IonButton
                            expand="block"
                            disabled={isFormDisabled}
                            onClick={(e) => submitVisit(e)}
                        >
                            {visit && visit.id ? "Modifica " : "Aggiungi "}
                            Visita
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
        </>
    );
};

export default FormVisit;
