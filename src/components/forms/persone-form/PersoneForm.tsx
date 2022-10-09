import {
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    useIonAlert,
    IonLoading,
    IonSelect,
    IonSelectOption,
    IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { useHistory } from "react-router";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useQueryData from "../../../hooks/use-query-data";
import useInput from "../../../hooks/use-input";
import useSelection from "../../../hooks/use-selection";
import { possibiliPersoneTypes } from "../../../types/persona_types";
import { possibiliProvenienzePersona } from "../../../types/provenienza_persona";
import axiosInstance from "../../../utils/axiosInstance";
import capitalize from "../../../utils/capitalize";
import errorHandler from "../../../utils/errorHandler";
import TextInput from "../../form-components/text_input/TextInput";
import Modal from "../../modal/Modal";
import Selector from "../../selector/Selector";
import styles from "./PersoneForm.module.css";
import FormGroup from "../../form-components/form-group/FormGroup";
import TextArea from "../../form-components/text_area/TextArea";
import ItemSelector from "../../form-components/item-selector/ItemSelector";

const PersoneForm: React.FC<{
    persona: Persona | null;
    backToList: () => void;
    setCurrentPersona: Dispatch<SetStateAction<Entity | null>>;
}> = (props) => {
    const history = useHistory();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const [choiceMode, setChoiceMode] = useState<
        "proprietà" | "locazione" | "interesse" | null
    >(null);

    const openModal = (type: "proprietà" | "locazione" | "interesse") => {
        setChoiceMode(type);
        setCurrentImmobile(null);
        setModalIsOpen(true);
    };

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const [listHouses, setListHouses] = useState<Immobile[]>(
        props.persona && props.persona.immobili
            ? (props.persona.immobili as Immobile[])
            : []
    );

    const deleteHouse = (
        id: number,
        mode: "proprietà" | "locazione" | "interesse"
    ) => {
        setCurrentImmobile(null);
        if (mode === "proprietà") {
            setListHouses((prevList) => {
                return prevList.filter((el) => el.id! !== id);
            });
        } else if (mode === "locazione") {
            setImmobileLocato(null);
        } else {
            setImmobileInteresse(null);
        }
    };

    const [immobileLocato, setImmobileLocato] = useState<Immobile | null>(
        props.persona && props.persona.immobileInquilino
            ? (props.persona.immobileInquilino as Immobile)
            : null
    );

    const [immobileInteresse, setImmobileInteresse] = useState<Immobile | null>(
        null
    );

    useEffect(() => {
        const addHouse = (immobile: Immobile) => {
            const itemAlreadyPresent = listHouses.find(
                (el) => el.id === immobile.id
            );
            if (!itemAlreadyPresent)
                setListHouses((prevList) => {
                    return [...prevList, immobile];
                });
        };

        setTimeout(() => {
            if (choiceMode === "interesse" && currentImmobile) {
                setImmobileInteresse(currentImmobile as Immobile);
                setModalIsOpen(false);
            } else if (choiceMode === "locazione" && currentImmobile) {
                setImmobileLocato(currentImmobile as Immobile);
                setModalIsOpen(false);
            } else if (choiceMode === "proprietà" && currentImmobile) {
                addHouse(currentImmobile as Immobile);
                setModalIsOpen(false);
            }
        }, 300);
    }, [currentImmobile, choiceMode, listHouses]);

    const {
        inputValue: inputNameValue,
        inputIsInvalid: inputNameIsInvalid,
        inputIsTouched: inputNameIsTouched,
        inputTouchedHandler: inputNameTouchedHandler,
        inputChangedHandler: inputNameChangedHandler,
        reset: inputNameReset,
    } = useInput(
        (el) => el.toString().trim().length > 4,
        props.persona ? props.persona.nome : undefined
    );

    const {
        inputValue: inputPhoneValue,
        inputIsInvalid: inputPhoneIsInvalid,
        inputIsTouched: inputPhoneIsTouched,
        inputTouchedHandler: inputPhoneTouchedHandler,
        inputChangedHandler: inputPhoneChangedHandler,
        reset: inputPhoneReset,
    } = useInput(
        (el) => el.toString().trim().length > 0,
        props.persona ? props.persona.telefono : null
    );

    const {
        inputValue: inputEmailValue,
        inputIsInvalid: inputEmailIsInvalid,
        inputIsTouched: inputEmailIsTouched,
        inputTouchedHandler: inputEmailTouchedHandler,
        inputChangedHandler: inputEmailChangedHandler,
        reset: inputEmailReset,
    } = useInput(
        (el) => /.+@.+\..+/.test(el.toString()),
        props.persona ? props.persona.email : null
    );

    const {
        inputValue: inputRuoloValue,
        inputIsInvalid: inputRuoloIsInvalid,
        inputTouchedHandler: inputRuoloTouchedHandler,
        inputChangedHandler: inputRuoloChangedHandler,
        reset: inputRuoloReset,
    } = useInput(() => true, props.persona ? props.persona.ruolo : null);

    const {
        inputValue: inputProvenienzaValue,
        inputIsInvalid: inputProvenienzaIsInvalid,
        inputTouchedHandler: inputProvenienzaTouchedHandler,
        inputChangedHandler: inputProvenienzaChangedHandler,
    } = useInput(
        () => true,
        props.persona && props.persona.provenienza
            ? props.persona.provenienza.toLowerCase().replace("_", " ")
            : null
    );

    const {
        inputValue: inputStatusValue,
        inputIsInvalid: inputStatusIsInvalid,
        inputTouchedHandler: inputStatusTouchedHandler,
        inputChangedHandler: inputStatusChangedHandler,
    } = useInput(
        (el) => el.toString().length > 0,
        props.persona ? props.persona.status : null
    );

    const {
        inputValue: inputNoteValue,
        inputChangedHandler: inputNoteChangedHandler,
        inputTouchedHandler: inputNoteTouchedHandler,
        reset: inputNoteReset,
    } = useInput(() => true);

    const queryData = useQueryData("persone");

    const getPhoneValue = () => {
        let phoneValue: string = inputPhoneValue
            .trim()
            .split(" ")
            .join("")
            .split("/")
            .join("");
        return phoneValue.length > 0 ? phoneValue : null;
    };

    const isFormInvalid =
        (!props.persona &&
            (!inputNameIsTouched ||
                (!inputEmailIsTouched && !inputPhoneIsTouched))) ||
        (inputEmailValue.trim().length === 0 &&
            (getPhoneValue() === null || getPhoneValue()!.length === 0)) ||
        inputNameIsInvalid ||
        inputPhoneIsInvalid ||
        inputEmailIsInvalid ||
        inputRuoloIsInvalid ||
        inputProvenienzaIsInvalid ||
        inputStatusIsInvalid;

    const changePersona = async (id: number) => {
        setShowLoading(true);
        try {
            const res = await axiosInstance.get(`persone/${id}`);
            const persona = res.data as Persona;
            props.setCurrentPersona(persona);
            inputNameChangedHandler(null, persona.nome);
            inputPhoneChangedHandler(null, persona.telefono);
            inputEmailChangedHandler(null, persona.email);
            inputRuoloChangedHandler(null, persona.ruolo);
            inputProvenienzaChangedHandler(
                null,
                persona.provenienza &&
                    persona.provenienza.toLowerCase().replace("_", " ")
            );
            inputStatusChangedHandler(null, persona.status);
            setImmobileLocato(
                persona.immobileInquilino
                    ? (persona.immobileInquilino as Immobile)
                    : null
            );
            setListHouses(
                persona && persona.immobili
                    ? (persona.immobili as Immobile[])
                    : []
            );
            setShowLoading(false);
        } catch (e) {
            setShowLoading(false);
            errorHandler(e, () => {}, "Procedura non riuscita", presentAlert);
        }
    };

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const reqBody = {
            id: props.persona ? props.persona.id : null,
            nome: inputNameValue,
            telefono: getPhoneValue(),
            email: inputEmailValue.length > 0 ? inputEmailValue : null,
            ruolo: inputRuoloValue,
            immobiliProprieta: listHouses.map((el) => el.id!),
            immobileAffitto: immobileLocato ? immobileLocato.id : null,
            immobileInteresse: immobileInteresse ? immobileInteresse.id : null,
            note: inputNoteValue,
            provenienza: inputProvenienzaValue.split(" ").join("_"),
            status: inputStatusValue,
        };
        setShowLoading(true);
        try {
            props.persona
                ? await axiosInstance.patch(
                      `persone/${props.persona!.id}`,
                      reqBody
                  )
                : await axiosInstance.post(`persone`, reqBody);
            setShowLoading(false);
            presentAlert({
                header: "Ottimo",
                subHeader: `Persona ${props.persona ? "modificata" : "creata"}`,
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
                presentAlert,
                changePersona
            );
        }
    };

    const [navigateToImmobile, setNavigateToImmobile] = useState<Entity | null>(
        null
    );

    useEffect(() => {
        setTimeout(() => {
            if (navigateToImmobile)
                history.push(`immobili/${navigateToImmobile.id}`);
        }, 300);
    }, [navigateToImmobile, history]);

    const { selectEntity, entitySelected } = useSelection(
        setNavigateToImmobile
    );

    const alertDeleteHouse = (
        id: number,
        mode: "proprietà" | "locazione" | "interesse"
    ) => {
        presentAlert({
            header: "Cancellazione dell'immobile",
            message: `La cancellazione diverrà effettiva al salvataggio ${
                props.persona ? "delle modifiche" : "della persona"
            }.`,
            buttons: [
                {
                    text: "Conferma",
                    handler: () => deleteHouse(id, mode),
                },
                {
                    text: "Cancella",
                    role: "cancel",
                },
            ],
        });
    };

    const getImmobili = (mode: "proprietà" | "locazione" | "interesse") => {
        let list: Immobile[] = [];
        if (mode === "proprietà") {
            list = listHouses;
        } else if (mode === "interesse" && immobileInteresse) {
            list = [immobileInteresse];
        } else if (mode === "locazione" && immobileLocato) {
            list = [immobileLocato];
        }
        return list.map((el) => {
            return (
                <IonItem
                    key={el!.id}
                    color={
                        entitySelected && entitySelected === el!.id
                            ? "tertiary"
                            : undefined
                    }
                    onClick={() => selectEntity(el!)}
                >
                    <IonLabel text-wrap>
                        <h3>Riferimento {el!.ref}</h3>
                        <p>{el!.titolo}</p>
                    </IonLabel>
                    <IonIcon
                        slot="end"
                        className={styles.icon}
                        icon={closeOutline}
                        onClick={() => alertDeleteHouse(el!.id!, mode)}
                    ></IonIcon>
                </IonItem>
            );
        });
    };

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormGroup title="Dati base">
                    <TextInput
                        title={"Nome (Obbligatorio - almeno 5 lettere)"}
                        inputValue={inputNameValue}
                        type={"text"}
                        inputIsInvalid={inputNameIsInvalid}
                        inputChangeHandler={inputNameChangedHandler}
                        inputTouchHandler={inputNameTouchedHandler}
                        errorMessage={"Nome troppo corto"}
                        reset={inputNameReset}
                    />
                    <TextInput
                        title={"Telefono"}
                        inputValue={inputPhoneValue}
                        type={"text"}
                        inputIsInvalid={inputPhoneIsInvalid}
                        inputChangeHandler={inputPhoneChangedHandler}
                        inputTouchHandler={inputPhoneTouchedHandler}
                        errorMessage={"Telefono non valido"}
                        reset={inputPhoneReset}
                    />
                    <TextInput
                        title={"Email"}
                        inputValue={inputEmailValue}
                        type={"email"}
                        inputIsInvalid={inputEmailIsInvalid}
                        inputChangeHandler={inputEmailChangedHandler}
                        inputTouchHandler={inputEmailTouchedHandler}
                        errorMessage={"Email non valida"}
                        reset={inputEmailReset}
                    />
                    {props.persona && (
                        <IonItem>
                            <IonLabel
                                position="floating"
                                color={inputStatusIsInvalid ? "danger" : "dark"}
                            >
                                Status
                            </IonLabel>
                            <IonSelect
                                cancelText="Torna Indietro"
                                mode="ios"
                                interface="action-sheet"
                                value={inputStatusValue}
                                onIonChange={inputStatusChangedHandler}
                                onIonBlur={inputStatusTouchedHandler}
                            >
                                {possibiliPersoneTypes.map((el) => (
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
                    <IonItem>
                        <IonLabel
                            position="floating"
                            color={
                                inputProvenienzaIsInvalid ? "danger" : "dark"
                            }
                        >
                            Provenienza
                        </IonLabel>
                        <IonSelect
                            cancelText="Torna Indietro"
                            mode="ios"
                            interface="action-sheet"
                            value={inputProvenienzaValue}
                            onIonChange={inputProvenienzaChangedHandler}
                            onIonBlur={inputProvenienzaTouchedHandler}
                        >
                            {possibiliProvenienzePersona.map((el) => (
                                <IonSelectOption
                                    key={el}
                                    value={el.toString().toLowerCase()}
                                >
                                    {capitalize(el.toLowerCase())}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                    <TextInput
                        title={"Ruolo"}
                        inputValue={inputRuoloValue}
                        type={"text"}
                        inputIsInvalid={inputRuoloIsInvalid}
                        inputChangeHandler={inputRuoloChangedHandler}
                        inputTouchHandler={inputRuoloTouchedHandler}
                        errorMessage={"Ruolo non valido"}
                        reset={inputRuoloReset}
                    />
                    {!props.persona && (
                        <TextArea
                            title={"Note"}
                            inputValue={inputNoteValue}
                            inputChangeHandler={inputNoteChangedHandler}
                            inputTouchHandler={inputNoteTouchedHandler}
                            reset={inputNoteReset}
                        />
                    )}
                </FormGroup>
                {!props.persona && (
                    <ItemSelector
                        titoloGruppo="Immobile d'Interesse"
                        titoloBottone="Aggiungi Casa d'Interesse"
                        item={immobileInteresse}
                        getItem={() => getImmobili("interesse")}
                        openSelector={() => openModal("interesse")}
                    />
                )}
                <ItemSelector
                    titoloGruppo="Immobili di Proprietà"
                    titoloBottone="Aggiungi Casa di Proprietà"
                    item={listHouses}
                    getItem={() => getImmobili("proprietà")}
                    openSelector={() => openModal("proprietà")}
                    multiple
                />
                <ItemSelector
                    titoloGruppo="Immobile Locato"
                    titoloBottone="Aggiungi Casa in cui è Inquilino"
                    item={immobileLocato}
                    getItem={() => getImmobili("locazione")}
                    openSelector={() => openModal("locazione")}
                />
                <IonButton
                    expand="block"
                    disabled={isFormInvalid}
                    onClick={(e) => submitForm(e)}
                >
                    {props.persona ? "Modifica" : "Aggiungi"} persona
                </IonButton>
            </IonList>
            <Modal
                setIsOpen={setModalIsOpen}
                isOpen={modalIsOpen}
                title={`Scegli immobile di ${choiceMode}`}
                handler={() => setModalIsOpen(false)}
            >
                <Selector
                    entitiesType="immobili"
                    setCurrentEntity={setCurrentImmobile}
                    selectMode
                    queryData={queryData}
                />
            </Modal>
        </form>
    );
};

export default PersoneForm;
