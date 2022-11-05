import {
    IonIcon,
    IonLabel,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    peopleOutline,
    thumbsUpOutline,
    trashBinOutline,
} from "ionicons/icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { Visit } from "../../../entities/visit.model";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import FormVisit from "../../forms/visit-form/VisitForm";
import Modal from "../../modal/Modal";
import styles from "./VisitItem.module.css";

const VisitItem: React.FC<{ visita: Visit }> = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const confermaEliminaVisita = async () => {
        try {
            setShowLoading(true);
            await axiosInstance.delete("/visite/" + props.visita!.id);
            setModalIsOpen(false);
            setTimeout(() => {
                //doUpdate((prevState) => ++prevState);
            }, 300);
        } catch (e) {
            setModalIsOpen(false);
            setShowLoading(false);
            setTimeout(() => {
                errorHandler(
                    e,
                    () => {},
                    "Cancellazione non riuscita",
                    presentAlert
                );
            }, 300);
        }
    };

    const alertEliminaVisita = () => {
        presentAlert({
            header: "Sei sicuro?",
            message: `La cancellazione della visita è irreversibile.`,
            buttons: [
                {
                    text: "Procedi",
                    handler: () => confermaEliminaVisita(),
                },
                {
                    text: "Indietro",
                    role: "cancel",
                },
            ],
        });
    };

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div
                key={props.visita.id! + Math.random() * 1000}
                onClick={() => setModalIsOpen(true)}
                className={`${styles.app} ${styles.meeting}`}
            >
                <IonIcon icon={peopleOutline} />
            </div>
            <Modal
                key={props.visita.id}
                setIsOpen={setModalIsOpen}
                isOpen={modalIsOpen}
                title={`Dettagli Visita`}
                handler={() => setModalIsOpen(false)}
            >
                <div
                    style={{ height: "200px", width: "200px" }}
                    className="centered"
                >
                    BU
                </div>
                {/* <FormVisit readonly visit={props.visita} />
                <IonSegment mode="ios">
                    <IonSegmentButton value="conferma" onClick={() => {}}>
                        <IonIcon icon={thumbsUpOutline} />
                        <IonLabel>Conferma</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="modifica" onClick={() => {}}>
                        <IonIcon icon={createOutline} />
                        <IonLabel>Modifica</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton
                        value="elimina"
                        onClick={() => {
                            alertEliminaVisita();
                        }}
                    >
                        <IonIcon icon={trashBinOutline} />
                        <IonLabel>Elimina</IonLabel>
                    </IonSegmentButton>
                </IonSegment> */}
            </Modal>
        </>
    );
};

export default React.memo(VisitItem);
