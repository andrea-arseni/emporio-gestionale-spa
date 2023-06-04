import {
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonLoading,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useInput from "../../../hooks/use-input";
import { possibiliPersoneTypes } from "../../../types/persona_types";
import { possibiliProvenienzePersona } from "../../../types/provenienza_persona";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
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
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";
import { useAppDispatch } from "../../../hooks";
import { setPersona } from "../../../store/persona-slice";

const PersoneForm: React.FC<{
    persona: Persona | null;
    backToList: () => void;
}> = (props) => {
    const [persona] = useState<Persona | null>(props.persona);

    const dispatch = useAppDispatch();

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const navigate = useNavigate();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [isQuerySuccessfull, setIsQuerySuccessfull] =
        useState<boolean>(false);

    const ionSelectStatus = useRef<HTMLIonSelectElement>(null);
    const ionSelectProvenienza = useRef<HTMLIonSelectElement>(null);

    const {
        hasBeenClicked,
        setHasBeenClicked,
        closeIonSelects,
        isFocusOnTextArea,
        activateTextAreaFocus,
        deactivateTextAreaFocus,
    } = useSingleClick();

    const [choiceMode, setChoiceMode] = useState<
        "proprietà" | "locazione" | "interesse" | null
    >(null);

    const openModal = (type: "proprietà" | "locazione" | "interesse") => {
        setChoiceMode(type);
        setCurrentImmobile(null);
        setModalIsOpen(true);
    };

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const [listHouses, setListHouses] = useState<Immobile[]>([]);

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
        persona && persona.immobileInquilino
            ? (persona.immobileInquilino as Immobile)
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
        persona ? persona.nome : undefined
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
        persona ? persona.telefono : null
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
        persona ? persona.email : null
    );

    const {
        inputValue: inputRuoloValue,
        inputIsInvalid: inputRuoloIsInvalid,
        inputTouchedHandler: inputRuoloTouchedHandler,
        inputChangedHandler: inputRuoloChangedHandler,
        reset: inputRuoloReset,
    } = useInput(() => true, persona ? persona.ruolo : null);

    const {
        inputValue: inputProvenienzaValue,
        inputIsInvalid: inputProvenienzaIsInvalid,
        inputTouchedHandler: inputProvenienzaTouchedHandler,
        inputChangedHandler: inputProvenienzaChangedHandler,
    } = useInput(
        () => true,
        persona && persona.provenienza
            ? persona.provenienza.toLowerCase().replace("_", " ")
            : null
    );

    const {
        inputValue: inputStatusValue,
        inputIsInvalid: inputStatusIsInvalid,
        inputTouchedHandler: inputStatusTouchedHandler,
        inputChangedHandler: inputStatusChangedHandler,
    } = useInput(
        (el) => el.toString().length > 0,
        persona ? persona.status : null
    );

    const {
        inputValue: inputNoteValue,
        inputChangedHandler: inputNoteChangedHandler,
        inputTouchedHandler: inputNoteTouchedHandler,
        reset: inputNoteReset,
    } = useInput(() => true);

    useEffect(() => {
        const fetchPersona = async () => {
            try {
                const res = await axiosInstance.get(`/persone/${persona?.id!}`);
                if (res && res.data) {
                    if (res.data.immobili)
                        setListHouses(res.data.immobili as Immobile[]);
                    if (res.data.immobileInquilino)
                        setImmobileLocato(res.data.immobileInquilino);
                }
            } catch (e) {
                errorHandler(e, "Impossibile aprire la persona selezionata");
            }
        };

        if (persona) fetchPersona();
    }, [persona, errorHandler]);

    const noteTouchHandler = () => {
        inputNoteTouchedHandler();
        deactivateTextAreaFocus();
    };

    const getPhoneValue = useCallback(() => {
        let phoneValue: string = inputPhoneValue
            .trim()
            .split(" ")
            .join("")
            .split("/")
            .join("");
        return phoneValue.length > 0 ? phoneValue : null;
    }, [inputPhoneValue]);

    const isFormInvalid =
        (!persona &&
            (!inputNameIsTouched ||
                (!inputEmailIsTouched && !inputPhoneIsTouched))) ||
        (inputEmailValue.trim().length === 0 &&
            (getPhoneValue() === null || getPhoneValue()!.length === 0)) ||
        inputNameIsInvalid ||
        inputPhoneIsInvalid ||
        inputEmailIsInvalid ||
        inputRuoloIsInvalid ||
        !inputProvenienzaValue ||
        inputProvenienzaIsInvalid ||
        inputStatusIsInvalid;

    const getSubmitText = () => {
        if (!persona && !inputNameIsTouched) return "Nome obbligatorio";
        if (inputNameIsInvalid) return "Nome da correggere";

        if (
            (!persona && !inputPhoneIsTouched && !inputEmailIsTouched) ||
            (inputEmailValue.trim().length === 0 &&
                (getPhoneValue() === null || getPhoneValue()!.length === 0))
        )
            return "Indicare uno tra telefono e email";
        if (inputPhoneIsInvalid) return "Telefono da correggere";
        if (inputEmailIsInvalid) return "Email da correggere";
        if (inputRuoloIsInvalid) return "Ruolo da correggere";
        if (!inputProvenienzaValue) return "Provenienza obbligatoria";
        if (inputProvenienzaIsInvalid) return "Provenienza da correggere";
        if (inputStatusIsInvalid) return "Status da correggere";
        return `${persona ? "Modifica" : "Aggiungi"} persona`;
    };

    const eseguiForm = useCallback(async () => {
        const reqBody = {
            id: persona ? persona.id : null,
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
            const res = persona
                ? await axiosInstance.patch(`persone/${persona!.id}`, reqBody)
                : await axiosInstance.post(`persone`, reqBody);
            setShowLoading(false);
            setIsQuerySuccessfull(true);
            dispatch(setPersona(res.data));
            presentAlert({
                header: "Ottimo",
                subHeader: `Persona ${persona ? "modificata" : "creata"}`,
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
                errorHandler(error, "Procedura non riuscita");
            }
        }
    }, [
        dispatch,
        errorHandler,
        getPhoneValue,
        immobileInteresse,
        immobileLocato,
        inputEmailValue,
        inputNoteValue,
        inputNameValue,
        inputProvenienzaValue,
        inputRuoloValue,
        inputStatusValue,
        listHouses,
        persona,
        navigate,
        presentAlert,
        props,
    ]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    useEffect(() => {
        const getPhoneValue = () => {
            let phoneValue: string = inputPhoneValue
                .trim()
                .split(" ")
                .join("")
                .split("/")
                .join("");
            return phoneValue.length > 0 ? phoneValue : null;
        };

        const isFormDisabled =
            (!persona &&
                (!inputNameIsTouched ||
                    (!inputEmailIsTouched && !inputPhoneIsTouched))) ||
            (inputEmailValue.trim().length === 0 &&
                (getPhoneValue() === null || getPhoneValue()!.length === 0)) ||
            inputNameIsInvalid ||
            inputPhoneIsInvalid ||
            inputEmailIsInvalid ||
            inputRuoloIsInvalid ||
            !inputProvenienzaValue ||
            inputProvenienzaIsInvalid ||
            inputStatusIsInvalid;

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (
                !isFormDisabled &&
                !isError &&
                e.key === "Enter" &&
                !isFocusOnTextArea
            ) {
                setHasBeenClicked(true);
                closeIonSelects([ionSelectStatus, ionSelectProvenienza]);
                if (isQuerySuccessfull) {
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
        errorHandler,
        eseguiForm,
        setHasBeenClicked,
        closeIonSelects,
        persona,
        isFocusOnTextArea,
        hasBeenClicked,
        isError,
        immobileInteresse,
        immobileLocato,
        inputEmailIsInvalid,
        inputEmailIsTouched,
        inputEmailValue,
        inputNameIsInvalid,
        inputNameIsTouched,
        inputNameValue,
        inputNoteValue,
        inputPhoneIsInvalid,
        inputPhoneIsTouched,
        inputPhoneValue,
        inputProvenienzaIsInvalid,
        inputProvenienzaValue,
        inputRuoloIsInvalid,
        inputRuoloValue,
        inputStatusIsInvalid,
        inputStatusValue,
        listHouses,
        navigate,
        hideAlert,
        isQuerySuccessfull,
        props,
    ]);

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
                        autofocus
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
                    {persona && (
                        <IonItem>
                            <IonLabel
                                position="floating"
                                color={inputStatusIsInvalid ? "danger" : "dark"}
                            >
                                Status
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
                            ref={ionSelectProvenienza}
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
                    {!persona && (
                        <TextArea
                            title={"Note"}
                            inputValue={inputNoteValue}
                            inputChangeHandler={inputNoteChangedHandler}
                            inputTouchHandler={noteTouchHandler}
                            focusHandler={activateTextAreaFocus}
                            reset={inputNoteReset}
                        />
                    )}
                </FormGroup>
                {!persona && (
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
                    {getSubmitText()}
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
