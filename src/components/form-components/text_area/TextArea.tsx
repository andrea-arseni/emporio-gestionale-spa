import { IonIcon, IonItem, IonLabel, IonNote, IonTextarea } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const TextArea: React.FC<{
    title: string;
    inputValue: string;
    inputIsInvalid: boolean;
    inputChangeHandler: (e: any) => void;
    inputTouchHandler: () => void;
    reset: () => void;
    errorMessage: string;
}> = (props) => {
    return (
        <IonItem>
            <IonLabel position="floating">{props.title}</IonLabel>
            <IonTextarea
                auto-grow
                rows={6}
                value={props.inputValue}
                onIonChange={props.inputChangeHandler}
                onIonBlur={props.inputTouchHandler}
            ></IonTextarea>
            {props.inputIsInvalid && (
                <IonNote color="danger">{props.errorMessage}</IonNote>
            )}
            {props.inputValue && (
                <IonIcon
                    slot="end"
                    style={{ position: "relative", top: "10px" }}
                    icon={closeOutline}
                    onClick={() => {
                        props.reset();
                    }}
                ></IonIcon>
            )}
        </IonItem>
    );
};

export default TextArea;
