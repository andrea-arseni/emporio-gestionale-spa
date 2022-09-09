import { IonItem, IonLabel, IonInput } from "@ionic/react";
import { immobileAttribute } from "../../../types/immobili_attributes";

const FormInputText: React.FC<{
    titolo: string;
    value: string | null;
    changeHandler: (e: any, immobileAttribute: immobileAttribute) => void;
    type: immobileAttribute;
}> = (props) => {
    return (
        <IonItem>
            <IonLabel position="floating">{props.titolo}</IonLabel>
            <IonInput
                type="text"
                value={props.value}
                onIonChange={(e) => props.changeHandler(e, props.type)}
            ></IonInput>
        </IonItem>
    );
};

export default FormInputText;
