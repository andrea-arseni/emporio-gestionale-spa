import { IonItem, useIonAlert, IonIcon } from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";

const SecondaryItem: React.FC<{
    deleteAction?: () => void;
    visualizeAction?: () => void;
    addAction?: () => void;
    directDeleting?: boolean;
}> = (props) => {
    const [presentAlert] = useIonAlert();

    const alertDeleteEntity = () => {
        presentAlert({
            header: "Cancellazione in corso",
            message: `La cancellazione diverrà effettiva al salvataggio.`,
            buttons: [
                {
                    text: "Conferma",
                    handler: () => props.deleteAction!(),
                },
                {
                    text: "Annulla",
                    role: "cancel",
                },
            ],
        });
    };

    return (
        <IonItem>
            {props.children}
            {props.deleteAction && (
                <IonIcon
                    onClick={() =>
                        props.directDeleting
                            ? props.deleteAction!()
                            : alertDeleteEntity()
                    }
                    color={"danger"}
                    icon={closeCircleOutline}
                    title={"Elimina"}
                />
            )}
        </IonItem>
    );
};

export default SecondaryItem;
