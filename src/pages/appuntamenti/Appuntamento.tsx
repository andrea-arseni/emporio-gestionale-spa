import { useIonAlert, IonButton, IonIcon } from "@ionic/react";
import {
    personAddOutline,
    createOutline,
    trashBinOutline,
    backspaceOutline,
    logoWhatsapp,
} from "ionicons/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SinglePageData from "../../components/single-page-component/SinglePageData";
import SinglePageItem from "../../components/single-page-component/SinglePageItem";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useErrorHandler from "../../hooks/use-error-handler";
import useWindowSize from "../../hooks/use-size";
import { closeIonSelect } from "../../utils/closeIonSelect";
import { saveContact, isNativeApp } from "../../utils/contactUtils";
import { getDayName } from "../../utils/timeUtils";
import { isUserAdmin } from "../../utils/userUtils";
import useInput from "../../hooks/use-input";
import { getConfermaVisitaMessage } from "../../utils/messageUtils";
import ModalMessage from "../../components/modal/modal-message/ModalMessage";
import {
    isSharingAvailable,
    NOT_SHAREABLE_MSG,
    shareObject,
} from "../../utils/shareUtils";
import { changeLoading } from "../../store/ui-slice";
import axiosInstance from "../../utils/axiosInstance";
import { triggerAppuntamentiUpdate } from "../../store/appuntamenti-slice";

const Appuntamento: React.FC<{
    modalActions?: {
        modificaVisita: () => void;
        confermaVisita: () => void;
        smontaModale: () => void;
    };
}> = (props) => {
    const navigate = useNavigate();

    const [clickBlocked, setClickBlocked] = useState<boolean>(true);

    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const visita = useAppSelector((state) => state.appuntamenti.currentVisit);

    useEffect(() => {
        closeIonSelect();
    }, []);

    useEffect(() => {
        const timeout: NodeJS.Timeout = setTimeout(() => {
            setClickBlocked(false);
        }, 1000);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => {
        if (clickBlocked) return;
        props.modalActions ? props.modalActions.smontaModale() : navigate(-1);
    };

    const addPersonaToRubrica = () => {
        if (clickBlocked) return;
        saveContact(presentAlert, visita?.persona!, errorHandler);
    };

    const openForm = () => {
        if (clickBlocked) return;
        props.modalActions
            ? props.modalActions.modificaVisita()
            : navigate(`modifica`);
    };

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
    } = useInput(() => true, "");

    const confermaVisita = () => {
        if (props.modalActions) {
            props.modalActions.confermaVisita();
        } else {
            inputNoteChangedHandler(
                null,
                getConfermaVisitaMessage(visita!, userData!)
            );
            setModalIsOpen(true);
        }
    };

    const produceUrl = () =>
        visita && visita.immobile
            ? process.env.REACT_APP_PUBLIC_WEBSITE_URL! + visita!.immobile.id!
            : undefined;

    const sendConfirmationMessage = async () => {
        if (!isSharingAvailable()) {
            errorHandler(null, NOT_SHAREABLE_MSG);
            return;
        }

        try {
            const url = produceUrl();
            await shareObject(inputNoteValue, url, "Conferma Visita");
            setModalIsOpen(false);
        } catch (error) {
            errorHandler(null, `Condivisione testo non riuscita.`);
        }
    };

    const deleteEntity = () => {
        presentAlert({
            header: "Attenzione!",
            subHeader: "La cancellazione è irreversibile. Sei sicuro?",
            buttons: [
                {
                    text: "Conferma",
                    handler: () => confirmDeleteEntity(),
                },
                {
                    text: "Indietro",
                    role: "cancel",
                },
            ],
        });
    };

    const confirmDeleteEntity = async () => {
        dispatch(changeLoading(true));
        await new Promise((r) => setTimeout(r, 400));
        let url = "/visite/" + visita?.id;
        try {
            await axiosInstance.delete(url);
            dispatch(changeLoading(false));
            dispatch(triggerAppuntamentiUpdate());
            props.modalActions
                ? props.modalActions.smontaModale()
                : navigate(-1);
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(e, "Eliminazione non riuscita");
        }
    };

    const [width] = useWindowSize();

    return (
        <>
            <div className="singlePageFrame">
                <div className="singlePageInnerFrame">
                    <SinglePageData chiave="Data">
                        {getDayName(
                            new Date(visita?.quando!),
                            width > 400 ? "long" : "short"
                        )}
                    </SinglePageData>
                    <SinglePageData chiave="Ora">
                        {visita?.quando!.split("T")[1].substring(0, 5)}
                    </SinglePageData>
                    <SinglePageData chiave="Incaricato">
                        {visita?.user?.name}
                    </SinglePageData>
                    {visita?.persona && (
                        <SinglePageItem
                            titolo={`Persona`}
                            type="persone"
                            entities={[visita.persona]}
                        />
                    )}
                    {visita?.immobile && (
                        <SinglePageItem
                            titolo={`Immobile`}
                            type="immobili"
                            entities={[visita.immobile]}
                        />
                    )}
                    {visita?.dove && (
                        <SinglePageData chiave="Dove">
                            {visita?.dove}
                        </SinglePageData>
                    )}
                    {visita?.note && (
                        <SinglePageData chiave="Note">
                            {visita?.note}
                        </SinglePageData>
                    )}
                    <br />
                    <br />
                    {isNativeApp && visita?.persona && (
                        <IonButton
                            className="singlePageGeneralButton"
                            color="primary"
                            mode="ios"
                            fill="solid"
                            onClick={addPersonaToRubrica}
                        >
                            <IonIcon
                                className="rightSpace"
                                icon={personAddOutline}
                            />
                            {`Aggiungi persona a rubrica`}
                        </IonButton>
                    )}
                    <IonButton
                        className="singlePageGeneralButton"
                        color="success"
                        mode="ios"
                        fill="solid"
                        onClick={confermaVisita}
                    >
                        <IonIcon className="rightSpace" icon={logoWhatsapp} />
                        Conferma visita
                    </IonButton>
                    <IonButton
                        className="singlePageGeneralButton"
                        color="secondary"
                        mode="ios"
                        fill="solid"
                        onClick={openForm}
                    >
                        <IonIcon className="rightSpace" icon={createOutline} />
                        Modifica visita
                    </IonButton>
                    {isUserAdmin(userData) && (
                        <IonButton
                            className="singlePageGeneralButton"
                            color="danger"
                            mode="ios"
                            fill="solid"
                            onClick={deleteEntity}
                        >
                            <IonIcon
                                className="rightSpace"
                                icon={trashBinOutline}
                            />
                            Cancella Visita
                        </IonButton>
                    )}
                    <IonButton
                        className="singlePageGeneralButton"
                        color="medium"
                        mode="ios"
                        fill="solid"
                        onClick={navigateBack}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={backspaceOutline}
                        />
                        Torna Indietro
                    </IonButton>
                </div>
            </div>
            <ModalMessage
                url={produceUrl()}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                handler={sendConfirmationMessage}
                inputValue={inputNoteValue}
                inputTouchedHandler={inputNoteTouchedHandler}
                inputChangedHandler={inputNoteChangedHandler}
                inputIsInvalid={inputNoteIsInvalid}
            />
        </>
    );
};

export default Appuntamento;
