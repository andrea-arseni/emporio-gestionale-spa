import {
    IonItem,
    useIonAlert,
    IonItemOptions,
    IonItemSliding,
} from "@ionic/react";
import { closeOutline, openOutline } from "ionicons/icons";
import ItemOption from "../../lists/ItemOption";
import styles from "./SecondaryItem.module.css";

const SecondaryItem: React.FC<{
    deleteAction: () => void;
    visualizeAction?: () => void;
    closeItems: () => void;
}> = (props) => {
    const [presentAlert] = useIonAlert();

    const alertDeleteEntity = () => {
        presentAlert({
            header: "Cancellazione in corso",
            message: `La cancellazione diverrà effettiva al salvataggio.`,
            buttons: [
                {
                    text: "Conferma",
                    handler: () => props.deleteAction(),
                },
                {
                    text: "Annulla",
                    handler: () => props.closeItems(),
                },
            ],
        });
    };

    return (
        <IonItemSliding className={styles.item}>
            <IonItem detail>{props.children}</IonItem>
            <IonItemOptions side="end">
                {props.visualizeAction && (
                    <ItemOption
                        handler={() => props.visualizeAction!()}
                        colorType={"primary"}
                        icon={openOutline}
                        title={"Apri"}
                    />
                )}
                <ItemOption
                    handler={() => alertDeleteEntity()}
                    colorType={"danger"}
                    icon={closeOutline}
                    title={"Elimina"}
                />
            </IonItemOptions>
        </IonItemSliding>
    );

    /* return (
        <IonItem>
            {props.children}
            {props.visualizeAction && (
                <IonIcon
                    slot="end"
                    className={styles.icon}
                    icon={openOutline}
                    onClick={() => props.visualizeAction!()}
                ></IonIcon>
            )}
            <IonIcon
                slot="end"
                className={styles.icon}
                icon={closeOutline}
                onClick={() => alertDeleteEntity()}
            ></IonIcon>
        </IonItem>
    ); */
};

export default SecondaryItem;
