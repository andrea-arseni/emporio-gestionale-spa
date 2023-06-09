import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import FormTextArea from "../../../components/form-components/form-text-area/FormTextArea";
import useInput from "../../../hooks/use-input";
import { IonButton, IonIcon, useIonAlert } from "@ionic/react";
import {
    personAddOutline,
    createOutline,
    trashBinOutline,
    backspaceOutline,
    logoWhatsapp,
} from "ionicons/icons";
import { isNativeApp, saveContact } from "../../../utils/contactUtils";
import { isUserAdmin } from "../../../utils/userUtils";
import SinglePageData from "../../../components/single-page-component/SinglePageData";
import axiosInstance from "../../../utils/axiosInstance";
import useErrorHandler from "../../../hooks/use-error-handler";
import { changeLoading } from "../../../store/ui-slice";
import { useEffect, useState } from "react";
import ModalMessage from "../../../components/modal/modal-message/ModalMessage";
import {
    NOT_SHAREABLE_MSG,
    isSharingAvailable,
    shareObject,
} from "../../../utils/shareUtils";
import { getInterestMessage } from "../../../utils/messageUtils";
import useDeleteEntity from "../../../hooks/use-delete-entity";
import SinglePageItem from "../../../components/single-page-component/SinglePageItem";
import { Immobile } from "../../../entities/immobile.model";

const EventPage: React.FC<{}> = () => {
    const currentPersona = useAppSelector((state) => state.persona.persona);
    const currentEvent = useAppSelector((state) => state.persona.evento);

    const dispatch = useAppDispatch();

    const [clickBlocked, setClickBlocked] = useState<boolean>(true);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setClickBlocked(false);
        }, 1000);
    }, []);

    let eventDescription =
        currentEvent && currentEvent.descrizione
            ? currentEvent.descrizione
            : null;

    if (
        currentEvent &&
        currentEvent.descrizione &&
        currentEvent.descrizione.indexOf("[") === 0 &&
        currentEvent.descrizione.includes("]")
    ) {
        eventDescription = currentEvent.descrizione.split("]")[1].trim();
    }

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
        reset: inputNoteReset,
    } = useInput(() => true, eventDescription);

    const {
        inputValue: inputMessageValue,
        inputTouchedHandler: inputMessageTouchedHandler,
        inputChangedHandler: inputMessageChangedHandler,
        inputIsInvalid: inputMessageIsInvalid,
    } = useInput(() => true, "");

    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const addPersonaToRubrica = () => {
        if (clickBlocked) return;
        saveContact(presentAlert, currentPersona!, errorHandler);
    };
    const submitForm = async () => {
        try {
            dispatch(changeLoading(true));
            await axiosInstance.patch(
                `/persone/${currentPersona!.id}/eventi/${currentEvent!.id}`,
                { descrizione: inputNoteValue.trim() }
            );
            dispatch(changeLoading(false));
            navigateBack();
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(e, "Modifica evento non riuscita");
        }
    };

    const navigate = useNavigate();
    const navigateBack = () => navigate(-1);

    const userData = useAppSelector((state) => state.auth.userData);

    const aggiornaPersona = async (id: number) => {
        const reqBody = {
            descrizione: "Scritto messaggio. Richiama lei.",
            statusPersona: "B_RICHIAMA_LEI",
        };
        try {
            await axiosInstance.post(`/persone/${id}/eventi`, reqBody);
            navigate(`/persone`);
        } catch (e) {
            alert("Aggiornamento non riuscito");
        }
    };

    const scriviPerInteressamento = () => {
        inputMessageChangedHandler(
            null,
            getInterestMessage(
                currentPersona!,
                currentEvent?.immobile!,
                userData!
            )
        );
        setModalIsOpen(true);
    };

    const produceUrl = () =>
        currentEvent?.immobile
            ? process.env.REACT_APP_PUBLIC_WEBSITE_URL! +
              currentEvent.immobile.id!
            : undefined;

    const sendInterestMessage = async () => {
        if (!isSharingAvailable()) {
            errorHandler(null, NOT_SHAREABLE_MSG);
            return;
        }

        try {
            await shareObject(inputNoteValue, produceUrl(), "Conferma Visita");
            setModalIsOpen(false);
            // modale con domanda se aggiornare stato della persona
            await presentAlert({
                header: "Condivisione riuscita",
                message: `Aggiornare stato di ${currentPersona?.nome}?`,
                buttons: [
                    {
                        text: "Sì",
                        // sì call con messaggio "Scritto messaggio. Richiama lei" e status
                        handler: () => aggiornaPersona(currentPersona!.id!),
                    },
                    {
                        text: "No",
                        role: "cancel",
                    },
                ],
            });
        } catch (error: any) {
            if (
                error &&
                error.message !== "Abort due to cancellation of share."
            )
                errorHandler(null, `Condivisione testo non riuscita.`);
        }
    };

    const { deleteEntity } = useDeleteEntity();

    return (
        <div className="singlePageFrame">
            <div className="singlePageInnerFrame">
                <SinglePageData chiave="Descrizione Evento" />
                <FormTextArea
                    autofocus
                    inputValue={inputNoteValue}
                    inputIsInvalid={inputNoteIsInvalid}
                    inputChangeHandler={inputNoteChangedHandler}
                    inputTouchHandler={inputNoteTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputNoteReset}
                />
                <IonButton
                    className="singlePageGeneralButton"
                    color="primary"
                    mode="ios"
                    fill="solid"
                    disabled={
                        inputNoteValue === eventDescription ||
                        inputNoteValue.toString().trim().length === 0
                    }
                    onClick={submitForm}
                >
                    <IonIcon className="rightSpace" icon={createOutline} />
                    Modifica descrizione
                </IonButton>
                {isNativeApp && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="secondary"
                        mode="ios"
                        fill="solid"
                        onClick={addPersonaToRubrica}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={personAddOutline}
                        />
                        Aggiungi a rubrica
                    </IonButton>
                )}
                {currentEvent?.immobile && (
                    <SinglePageItem
                        titolo={`Immobile d'interesse`}
                        type="immobili"
                        entities={[currentEvent.immobile] as Immobile[]}
                    />
                )}
                {currentEvent?.immobile && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="success"
                        mode="ios"
                        fill="solid"
                        onClick={scriviPerInteressamento}
                    >
                        <IonIcon className="rightSpace" icon={logoWhatsapp} />
                        Scrivi per interessamento
                    </IonButton>
                )}

                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        mode="ios"
                        fill="solid"
                        onClick={() =>
                            deleteEntity(
                                `persone/${currentPersona?.id}/eventi`,
                                currentEvent?.id?.toString()!
                            )
                        }
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella Evento
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="medium"
                    mode="ios"
                    fill="solid"
                    onClick={navigateBack}
                >
                    <IonIcon className="rightSpace" icon={backspaceOutline} />
                    Torna Indietro
                </IonButton>
            </div>
            <ModalMessage
                url={produceUrl()}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                handler={sendInterestMessage}
                inputValue={inputMessageValue}
                inputTouchedHandler={inputMessageTouchedHandler}
                inputChangedHandler={inputMessageChangedHandler}
                inputIsInvalid={inputMessageIsInvalid}
            />
        </div>
    );
    // nel caso immobile scrivi per interessamento
    // cancella evento
};

export default EventPage;
