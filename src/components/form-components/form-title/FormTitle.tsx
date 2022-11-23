import { IonToolbar, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import useSize from "../../../hooks/use-size";
import Title from "../../title/Title";

const FormTitle: React.FC<{
    title: string;
    handler: () => void;
    backToList?: boolean;
    fixed?: boolean;
}> = (props) => {
    const [widthScreen] = useSize();

    return (
        <IonToolbar
            mode="ios"
            className={`${props.fixed ? "fixed" : ""} bordered`}
        >
            {widthScreen >= 500 && props.backToList && (
                <IonButtons slot="start">
                    <IonButton
                        color="medium"
                        fill="solid"
                        onClick={props.handler}
                    >
                        Indietro
                    </IonButton>
                </IonButtons>
            )}
            {(widthScreen < 500 || !props.backToList) && (
                <IonButtons slot="end">
                    <IonButton onClick={props.handler}>
                        <IonIcon slot="icon-only" icon={closeOutline} />
                    </IonButton>
                </IonButtons>
            )}
            <Title>{props.title}</Title>
        </IonToolbar>
    );
};

export default FormTitle;
