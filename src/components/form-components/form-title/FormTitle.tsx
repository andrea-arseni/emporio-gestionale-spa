import {
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import useSize from "../../../hooks/use-size";

const FormTitle: React.FC<{
    title: string;
    handler: () => void;
    backToList?: boolean;
}> = (props) => {
    const [widthScreen] = useSize();

    return (
        <IonToolbar mode="ios">
            <IonButtons slot="end">
                {widthScreen >= 500 && props.backToList && (
                    <IonButton
                        color="medium"
                        fill="solid"
                        onClick={props.handler}
                    >
                        Torna alla Lista
                    </IonButton>
                )}
                {(widthScreen < 500 || !props.backToList) && (
                    <IonButton onClick={props.handler}>
                        <IonIcon slot="icon-only" icon={closeOutline} />
                    </IonButton>
                )}
            </IonButtons>
            <IonTitle>{props.title}</IonTitle>
        </IonToolbar>
    );
};

export default FormTitle;
