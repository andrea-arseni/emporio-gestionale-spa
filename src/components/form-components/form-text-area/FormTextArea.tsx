import { IonIcon, IonItem, IonLabel, IonNote, IonTextarea } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import React, { useEffect, useRef } from "react";

const FormTextArea: React.FC<{
    inputValue: string;
    inputChangeHandler: (e: any) => void;
    inputTouchHandler: () => void;
    title?: string;
    reset?: () => void;
    inputIsInvalid?: boolean;
    errorMessage?: string;
    readonly?: boolean;
    rows?: number;
    autofocus?: boolean;
    focusHandler?: () => void;
}> = (props) => {
    const ref = useRef<HTMLIonTextareaElement>(null);

    useEffect(() => {
        let mounted = true;

        const focus = async () => {
            await new Promise((r) => setTimeout(r, 300));
            if (!mounted) return;
            ref.current!.setFocus();
        };

        if (props.autofocus) {
            focus();
        }

        return () => {
            mounted = false;
        };
    }, [props.autofocus]);

    return (
        <IonItem className="formTextArea">
            {props.title && (
                <IonLabel
                    color={props.inputIsInvalid ? "danger" : undefined}
                    position="floating"
                >
                    {props.title}
                </IonLabel>
            )}
            <IonTextarea
                ref={ref}
                readonly={props.readonly}
                color={props.inputIsInvalid ? "danger" : undefined}
                auto-grow
                rows={props.rows ? props.rows : 6}
                value={props.inputValue}
                onIonChange={props.inputChangeHandler}
                onIonBlur={props.inputTouchHandler}
                onFocus={props.focusHandler}
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
