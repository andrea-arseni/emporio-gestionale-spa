import {
    IonModal,
    IonContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    trashBinOutline,
    chatboxEllipsesOutline,
} from "ionicons/icons";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setModalOpened } from "../../../store/ui-slice";
import FormTitle from "../../form-components/form-title/FormTitle";
import FormVisit from "../../forms/visit-form/VisitForm";

const CalendarModal: React.FC<{}> = () => {
    const modalIsOpen = useAppSelector((state) => state.ui.isModalOpened);

    const dispatch = useAppDispatch();

    const [presentAlert] = useIonAlert();

    const alertEliminaVisita = () => {
        presentAlert({
            header: "Sei sicuro?",
            message: `La cancellazione della visita è irreversibile.`,
            buttons: [
                {
                    text: "Procedi",
                    handler: () => console.log("Si va!"), //confermaEliminaVisita(),
                },
                {
                    text: "Indietro",
                    role: "cancel",
                },
            ],
        });
    };

    return (
        <IonModal
            showBackdrop
            isOpen={modalIsOpen}
            onDidDismiss={() => dispatch(setModalOpened(false))}
        >
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
                    <IonSegmentButton value="conferma" onClick={() => {}}>
                        <IonIcon icon={chatboxEllipsesOutline} />
                        <IonLabel>Conferma</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="modifica" onClick={() => {}}>
                        <IonIcon icon={createOutline} />
                        <IonLabel>Modifica</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton
                        value="elimina"
                        onClick={() => alertEliminaVisita()}
                    >
                        <IonIcon icon={trashBinOutline} />
                        <IonLabel>Elimina</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </IonContent>
        </IonModal>
    );
};

export default CalendarModal;
