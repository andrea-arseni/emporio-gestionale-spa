import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import capitalize from "../../../utils/capitalize";

const FormSelect: React.FC<{
    title: string;
    value: string | null | number;
    function: (e: any) => void;
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
                onIonChange={(e) => props.function(e)}
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
