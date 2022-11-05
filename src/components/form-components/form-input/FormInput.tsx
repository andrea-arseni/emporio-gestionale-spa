import { IonIcon, IonInput, IonItem, IonLabel, IonNote } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const FormInput: React.FC<{
    title: string;
    inputValue: string;
    type: "text" | "email" | "number";
    inputIsInvalid: boolean;
    inputChangeHandler: (e: any) => void;
    inputTouchHandler: () => void;
    reset: () => void;
    errorMessage: string;
    readonly?: boolean;
}> = (props) => {
    return (
        <IonItem>
            <IonLabel
                position="floating"
                color={props.inputIsInvalid ? "danger" : "dark"}
            >
                {props.title}
            </IonLabel>
            <IonInput
                readonly={props.readonly}
                autocomplete="off"
                color={props.inputIsInvalid ? "danger" : "dark"}
                type={props.type}
                value={props.inputValue}
                onIonChange={props.inputChangeHandler}
                onIonBlur={props.inputTouchHandler}
            ></IonInput>
            {props.inputIsInvalid && (
                <IonNote color="danger">{props.errorMessage}</IonNote>
            )}
            {props.inputValue && !props.readonly && (
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

export default FormInput;
