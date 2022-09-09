import { IonItem, IonLabel, IonInput, IonNote } from "@ionic/react";
import { immobileAttribute } from "../../../types/immobili_attributes";

const FormInputNumber: React.FC<{
    titolo: string;
    value: number | null;
    type: immobileAttribute;
    changeHandler: (e: any, type: immobileAttribute) => void;
    invalidCondition: boolean;
    invalidNote: string;
}> = (props) => {
    return (
        <IonItem>
            <IonLabel position="floating">{props.titolo}</IonLabel>
            <IonInput
                type="number"
                value={props.value}
                onIonChange={(e) => props.changeHandler(e, props.type)}
            ></IonInput>
            {props.invalidCondition && (
                <IonNote color="danger">{props.invalidNote}</IonNote>
            )}
        </IonItem>
    );
};

export default FormInputNumber;
