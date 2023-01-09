import {
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    useIonAlert,
    IonLoading,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useInput from "../../../hooks/use-input";
import { possibiliPersoneTypes } from "../../../types/persona_types";
import { possibiliProvenienzePersona } from "../../../types/provenienza_persona";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
import errorHandler from "../../../utils/errorHandler";
import FormInput from "../../form-components/form-input/FormInput";
import Modal from "../../modal/Modal";
import Selector from "../../selector/Selector";
import FormGroup from "../../form-components/form-group/FormGroup";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import SecondaryItem from "../../form-components/secondary-item/SecondaryItem";
import useList from "../../../hooks/use-list";
import { navigateToSpecificItem } from "../../../utils/navUtils";
import { useNavigate } from "react-router-dom";

const PersoneForm: React.FC<{
    persona: Persona | null;
    backToList: () => void;
    setCurrentPersona: Dispatch<SetStateAction<Entity | null>>;
}> = (props) => {
    const navigate = useNavigate();

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

        const timeOut = setTimeout(() => {
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

        return () => clearTimeout(timeOut);
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
        (el) => !el || el.toString().trim().length > 0,
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
        (el) => !el || /.+@.+\..+/.test(el.toString()),
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

            if (
                error &&
                error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.includes("E' la persona con id ")
            ) {
                const [message, id] = error.response.data.message.split(
                    "E' la persona con id "
                );
                presentAlert({
                    header: "Attenzione!",
                    message,
                    buttons: [
                        {
                            text: "Vai alla persona",
                            handler: () =>
                                navigateToSpecificItem("persone", id, navigate),
                        },
                        {
                            text: "Chiudi",
                            role: "cancel",
                        },
                    ],
                });
            } else {
                errorHandler(
                    error,
                    () => {},
                    "Procedura non riuscita",
                    presentAlert
                );
            }
        }
    };

    const { list: itemsList, closeItemsList } = useList();

    const getImmobili = (mode: "proprietà" | "locazione" | "interesse") => {
        let list: Immobile[] = [];
        if (mode === "proprietà") {
            list = listHouses;
        } else if (mode === "interesse" && immobileInteresse) {
            list = [immobileInteresse];
        } else if (mode === "locazione" && immobileLocato) {
            list = [immobileLocato];
        }
        const renderList = list.map((el) => {
            return (
                <SecondaryItem
                    key={el!.id}
                    deleteAction={() => deleteHouse(el!.id!, mode)}
                    visualizeAction={() =>
                        navigateToSpecificItem(
                            "immobili",
                            el!.id!.toString(),
                            navigate
                        )
                    }
                    closeItems={closeItemsList}
                >
                    <IonLabel text-wrap>
                        <h3>Riferimento {el!.ref}</h3>
                        <p>{el!.titolo}</p>
                    </IonLabel>
                </SecondaryItem>
            );
        });
        return (
            <IonList style={{ padding: "0", margin: "0" }} ref={itemsList}>
                {renderList}
            </IonList>
        );
    };

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormGroup title="Dati base">
                    <FormInput
                        title={"Nome (Obbligatorio - almeno 5 lettere)"}
                        inputValue={inputNameValue}
                        type={"text"}
                        inputIsInvalid={inputNameIsInvalid}
                        inputChangeHandler={inputNameChangedHandler}
                        inputTouchHandler={inputNameTouchedHandler}
                        errorMessage={"Nome troppo corto"}
                        reset={inputNameReset}
                    />
                    <FormInput
                        title={"Telefono"}
                        inputValue={inputPhoneValue}
                        type={"text"}
                        inputIsInvalid={inputPhoneIsInvalid}
                        inputChangeHandler={inputPhoneChangedHandler}
                        inputTouchHandler={inputPhoneTouchedHandler}
                        errorMessage={"Telefono non valido"}
                        reset={inputPhoneReset}
                    />
                    <FormInput
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
                    <FormInput
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
                        isItemPresent={!!immobileInteresse}
                        getItem={() => getImmobili("interesse")}
                        openSelector={() => openModal("interesse")}
                    />
                )}
                <ItemSelector
                    titoloGruppo="Immobili di Proprietà"
                    titoloBottone="Aggiungi Casa di Proprietà"
                    isItemPresent={!!listHouses}
                    getItem={() => getImmobili("proprietà")}
                    openSelector={() => openModal("proprietà")}
                    multiple
                />
                <ItemSelector
                    titoloGruppo="Immobile Locato"
                    titoloBottone="Aggiungi Casa in cui è Inquilino"
                    isItemPresent={!!immobileLocato}
                    getItem={() => getImmobili("locazione")}
                    openSelector={() => openModal("locazione")}
                />
                <IonButton
                    style={{ marginTop: "15px" }}
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
                    localQuery
                />
            </Modal>
        </form>
    );
};

export default PersoneForm;
