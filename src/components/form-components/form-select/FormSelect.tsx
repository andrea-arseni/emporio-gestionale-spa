import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { immobileAttribute } from "../../../types/immobili_attributes";
import capitalize from "../../../utils/capitalize";

const FormSelect: React.FC<{
    title: string;
    value: string | null | number;
    function: (e: any, type: immobileAttribute) => void;
    type: immobileAttribute;
    possibleValues: string[] | number[];
}> = (props) => {
    return (
        <IonItem>
            <IonLabel position="floating">{props.title}</IonLabel>
            <IonSelect
                cancelText="Torna Indietro"
                mode="ios"
                interface="action-sheet"
                value={props.value?.toString().toLowerCase()}
                onIonChange={(e) => props.function(e, props.type)}
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
};

export default FormSelect;
