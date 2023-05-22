import { IonIcon, IonItem, IonLabel, IonNote, IonTextarea } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useEffect, useRef } from "react";

const FormTextArea: React.FC<{
    title: string;
    inputValue: string;
    inputChangeHandler: (e: any) => void;
    inputTouchHandler: () => void;
    reset?: () => void;
    inputIsInvalid?: boolean;
    errorMessage?: string;
    readonly?: boolean;
    rows?: number;
    autofocus?: boolean;
}> = (props) => {
    const ref = useRef<HTMLIonTextareaElement>(null);

    useEffect(() => {
        const focus = async () => {
            await new Promise((r) => setTimeout(r, 300));
            ref.current!.setFocus();
        };

        if (props.autofocus) {
            focus();
        }
    }, [props.autofocus]);

    return (
        <IonItem>
            <IonLabel
                color={props.inputIsInvalid ? "danger" : undefined}
                position="floating"
            >
                {props.title}
            </IonLabel>
            <IonTextarea
                ref={ref}
                readonly={props.readonly}
                color={props.inputIsInvalid ? "danger" : undefined}
                auto-grow
                rows={props.rows ? props.rows : 6}
                value={props.inputValue}
                onIonChange={props.inputChangeHandler}
                onIonBlur={props.inputTouchHandler}
            ></IonTextarea>
            {props.inputIsInvalid && (
                <IonNote color="danger">{props.errorMessage}</IonNote>
            )}
            {props.inputValue && !props.readonly && props.reset && (
                <IonIcon
                    slot="end"
                    style={{ position: "relative", top: "10px" }}
                    icon={closeOutline}
                    onClick={() => {
                        props.reset!();
                    }}
                ></IonIcon>
            )}
        </IonItem>
    );
};

export default FormTextArea;
