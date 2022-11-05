import { IonButton, IonIcon, IonToolbar } from "@ionic/react";
import { arrowBackOutline, arrowForwardOutline } from "ionicons/icons";
import Title from "../../title/Title";

const ArrowsBar: React.FC<{
    moveBackward: () => void;
    moveForward: () => void;
    titolo: string;
}> = (props) => {
    return (
        <IonToolbar mode="ios" style={{ margin: "0" }}>
            <IonButton
                slot="start"
                fill="clear"
                color="light"
                onClick={props.moveBackward}
            >
                <IonIcon
                    color="dark"
                    slot="icon-only"
                    icon={arrowBackOutline}
                ></IonIcon>
            </IonButton>
            <Title>{props.titolo}</Title>
            <IonButton
                slot="end"
                fill="clear"
                color="light"
                onClick={props.moveForward}
            >
                <IonIcon
                    color="dark"
                    slot="icon-only"
                    icon={arrowForwardOutline}
                ></IonIcon>
            </IonButton>
        </IonToolbar>
    );
};

export default ArrowsBar;
