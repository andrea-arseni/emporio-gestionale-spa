import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { capitalize } from "../../../utils/stringUtils";
import React from "react";

const FormSelect: React.FC<{
    title: string;
    value: string | null | number;
    function: (e: any) => void;
    possibleValues: string[] | number[];
    ref?: any;
}> = React.forwardRef((props, ref: any) => {
    return (
        <IonItem>
            <IonLabel position="floating">{props.title}</IonLabel>
            <IonSelect
                ref={ref}
                cancelText="Torna Indietro"
                mode="ios"
                interface="action-sheet"
                value={props.value?.toString().toLowerCase()}
                onIonChange={props.function}
            >
                {props.possibleValues.map((el) => (
                    <IonSelectOption
                        key={el}
                        value={el.toString().toLowerCase()}
                    >
                        {typeof el === "string"
                            ? capitalize(el.toLowerCase().replace("_", " "))
                            : el}
                    </IonSelectOption>
                ))}
            </IonSelect>
        </IonItem>
    );
});

export default FormSelect;
