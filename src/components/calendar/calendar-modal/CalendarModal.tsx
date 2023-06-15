import {
    IonModal,
    IonContent,
    IonButton,
    isPlatform,
    IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import useInput from "../../../hooks/use-input";
import { setError, setModalOpened } from "../../../store/ui-slice";
import { getConfermaVisitaMessage } from "../../../utils/messageUtils";
import FormTextArea from "../../form-components/form-text-area/FormTextArea";
import FormTitle from "../../form-components/form-title/FormTitle";
import { isNativeApp } from "../../../utils/contactUtils";
import styles from "./CalendarModal.module.css";
import {
    NOT_SHAREABLE_MSG,
    isSharingAvailable,
    shareObject,
} from "../../../utils/shareUtils";
import useErrorHandler from "../../../hooks/use-error-handler";
import { useNavigate } from "react-router-dom";
import Appuntamento from "../../../pages/appuntamenti/Appuntamento";
import {
    arrowBackCircleOutline,
    attachOutline,
    logoWhatsapp,
    shareOutline,
} from "ionicons/icons";
import useWhatsApp from "../../../hooks/use-whatsapp";

const CalendarModal: React.FC<{}> = () => {
    const modalIsOpen = useAppSelector((state) => state.ui.isModalOpened);

    const visit = useAppSelector((state) => state.appuntamenti.currentVisit);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const { presentAlert, errorHandler } = useErrorHandler();

    const userData = useAppSelector((state) => state.auth.userData);

    const [modalMode, setModalMode] = useState<"visit" | "message">("visit");

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
    } = useInput(() => true, "");

    const confermaVisita = () => {
        setModalMode("message");
        inputNoteChangedHandler(
            null,
            getConfermaVisitaMessage(visit!, userData!)
        );
    };

    const smontaModale = () => {
        dispatch(setModalOpened(false));
        setModalMode("visit");
    };

    const [urlAdded, setUrlAdded] = useState<boolean>(false);

    const isUrlAvailable = visit && visit.immobile && visit.immobile.id;

    const produceUrl = () =>
        isUrlAvailable
            ? process.env.REACT_APP_PUBLIC_WEBSITE_URL! + visit.immobile!.id
            : undefined;

    const condividiConferma = async () => {
        if (!isSharingAvailable()) {
            errorHandler(null, NOT_SHAREABLE_MSG);
            return;
        }

        try {
            await shareObject(inputNoteValue, produceUrl(), "Conferma Visita");
            smontaModale();
        } catch (error) {
            errorHandler(null, `Condivisione testo non riuscita.`);
        }
    };

    const error: any = useAppSelector((state) => state.ui.error);

    const { whatsAppAvailable, sendWhatsapp } = useWhatsApp(
        visit?.persona?.telefono!,
        inputNoteValue
    );

    useEffect(() => {
        if (error && error.name === "eliminaVisita") {
            dispatch(setError(null));
            errorHandler(error.object, "Cancellazione non riuscita");
        }
    }, [error, presentAlert, dispatch, errorHandler]);

    const modificaVisita = () => {
        dispatch(setModalOpened(false));
        setTimeout(() => {
            navigate(`/appuntamenti/${visit?.id}/modifica`);
        }, 300);
    };

    const modalActions = {
        modificaVisita,
        confermaVisita,
        smontaModale,
    };

    return (
        <IonModal
            showBackdrop
            isOpen={modalIsOpen}
            onDidDismiss={smontaModale}
            className={isNativeApp && isPlatform("ios") ? styles.iosModal : ""}
        >
            {modalMode === "visit" && (
                <IonContent>
                    <FormTitle
                        fixed
                        backToList={false}
                        title={"Dettagli Visita"}
                        handler={() => dispatch(setModalOpened(false))}
                    />
                    <div style={{ paddingTop: "50px" }}>
                        <Appuntamento modalActions={modalActions} />
                    </div>
                </IonContent>
            )}

            {modalMode === "message" && (
                <IonContent>
                    <div className="singlePageFrame">
                        <div className="singlePageInnerFrame">
                            <h5>Messaggio</h5>
                            <FormTextArea
                                inputValue={inputNoteValue}
                                inputIsInvalid={inputNoteIsInvalid}
                                inputChangeHandler={inputNoteChangedHandler}
                                inputTouchHandler={inputNoteTouchedHandler}
                                errorMessage={"Input non valido"}
                                rows={12}
                            />
                            <IonButton
                                className="singlePageGeneralButton"
                                color="primary"
                                mode="ios"
                                fill="solid"
                                onClick={condividiConferma}
                            >
                                <IonIcon
                                    className="rightSpace"
                                    icon={shareOutline}
                                />
                                Invia Messaggio
                            </IonButton>
                            {whatsAppAvailable && visit?.persona?.telefono && (
                                <IonButton
                                    className="singlePageGeneralButton"
                                    color="success"
                                    mode="ios"
                                    fill="solid"
                                    onClick={sendWhatsapp}
                                >
                                    <IonIcon
                                        className="rightSpace"
                                        icon={logoWhatsapp}
                                    />
                                    Invia su WhatsApp
                                </IonButton>
                            )}
                            {isUrlAvailable && !urlAdded && (
                                <IonButton
                                    className="singlePageGeneralButton"
                                    color="dark"
                                    mode="ios"
                                    fill="solid"
                                    onClick={() => {
                                        inputNoteChangedHandler(
                                            null,
                                            inputNoteValue + " " + produceUrl()
                                        );
                                        setUrlAdded(true);
                                    }}
                                >
                                    <IonIcon
                                        className="rightSpace"
                                        icon={attachOutline}
                                    />
                                    Aggiungi link al testo
                                </IonButton>
                            )}
                            <IonButton
                                className="singlePageGeneralButton"
                                mode="ios"
                                fill="solid"
                                color="medium"
                                onClick={() => setModalMode("visit")}
                            >
                                <IonIcon
                                    className="rightSpace"
                                    icon={arrowBackCircleOutline}
                                />
                                Annulla
                            </IonButton>
                        </div>
                    </div>
                </IonContent>
            )}
        </IonModal>
    );
};

export default CalendarModal;
