import {
    IonModal,
    IonContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
    IonButton,
} from "@ionic/react";
import {
    createOutline,
    trashBinOutline,
    chatboxEllipsesOutline,
} from "ionicons/icons";
import { Share } from "@capacitor/share";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import useInput from "../../../hooks/use-input";
import { setFormActive } from "../../../store/appuntamenti-slice";
import { alertEliminaVisita } from "../../../store/appuntamenti-thunk";
import { setModalOpened } from "../../../store/ui-slice";
import errorHandler from "../../../utils/errorHandler";
import { checkShareability } from "../../../utils/fileUtils";
import { getConfermaVisitaMessage } from "../../../utils/messageUtils";
import { isUserAdmin } from "../../../utils/userUtils";
import FormTextArea from "../../form-components/form-text-area/FormTextArea";
import FormTitle from "../../form-components/form-title/FormTitle";
import FormVisit from "../../forms/visit-form/VisitForm";

const CalendarModal: React.FC<{}> = () => {
    const modalIsOpen = useAppSelector((state) => state.ui.isModalOpened);

    const visit = useAppSelector((state) => state.appuntamenti.currentVisit);

    const dispatch = useAppDispatch();

    const [presentAlert] = useIonAlert();

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

    const condividiConferma = async () => {
        if (!checkShareability(presentAlert)) return;

        try {
            await Share.share({
                text: inputNoteValue,
                url: visit?.immobile
                    ? process.env.REACT_APP_PUBLIC_WEBSITE_URL! +
                      visit.immobile.id!
                    : undefined,
                dialogTitle: "Conferma Visita",
                title: "Messaggio",
            });
            smontaModale();
        } catch (error) {
            errorHandler(
                null,
                () => {},
                `Condivisione testo non riuscita.`,
                presentAlert
            );
        }
    };

    const error: any = useAppSelector((state) => state.ui.error);

    useEffect(() => {
        if (error && error.name === "eliminaVisita") {
            errorHandler(
                error.object,
                () => {},
                "Cancellazione non riuscita",
                presentAlert
            );
        }
    }, [error, presentAlert]);

    const modificaVisita = () => {
        dispatch(setModalOpened(false));
        setTimeout(() => {
            dispatch(setFormActive(true));
        }, 300);
    };

    return (
        <IonModal showBackdrop isOpen={modalIsOpen} onDidDismiss={smontaModale}>
            {modalMode === "visit" && (
                <IonContent>
                    <FormTitle
                        fixed
                        backToList={false}
                        title={"Dettagli Visita"}
                        handler={() => dispatch(setModalOpened(false))}
                    />
                    <div style={{ paddingTop: "20px", paddingBottom: "60px" }}>
                        <FormVisit readonly />
                    </div>
                    <IonSegment mode="ios">
                        <IonSegmentButton
                            value="conferma"
                            onClick={confermaVisita}
                        >
                            <IonIcon icon={chatboxEllipsesOutline} />
                            <IonLabel>Conferma</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton
                            value="modifica"
                            onClick={modificaVisita}
                        >
                            <IonIcon icon={createOutline} />
                            <IonLabel>Modifica</IonLabel>
                        </IonSegmentButton>
                        {isUserAdmin(userData) && (
                            <IonSegmentButton
                                value="elimina"
                                onClick={() =>
                                    dispatch(
                                        alertEliminaVisita({ presentAlert })
                                    )
                                }
                            >
                                <IonIcon icon={trashBinOutline} />
                                <IonLabel>Elimina</IonLabel>
                            </IonSegmentButton>
                        )}
                    </IonSegment>
                </IonContent>
            )}

            {modalMode === "message" && (
                <IonContent>
                    <FormTextArea
                        title="Descrizione"
                        inputValue={inputNoteValue}
                        inputIsInvalid={inputNoteIsInvalid}
                        inputChangeHandler={inputNoteChangedHandler}
                        inputTouchHandler={inputNoteTouchedHandler}
                        errorMessage={"Input non valido"}
                        rows={12}
                    />
                    <IonButton expand="full" onClick={condividiConferma}>
                        Invia Messaggio
                    </IonButton>
                    <IonButton
                        color="light"
                        expand="full"
                        onClick={() => setModalMode("visit")}
                    >
                        Annulla
                    </IonButton>
                </IonContent>
            )}
        </IonModal>
    );
};

export default CalendarModal;
