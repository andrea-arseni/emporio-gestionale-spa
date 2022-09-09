import {
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonInput,
    IonTextarea,
} from "@ionic/react";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import { User } from "../../../entities/user.model";
import { Visit } from "../../../entities/visit.model";

const FormVisit: React.FC<{ visit: Visit }> = (props) => {
    const inputDoveChangedHandler = (e: any) => console.log(e.detail.value);
    const inputNoteChangedHandler = (e: any) => console.log(e.detail.value);

    return (
        <form className="form">
            <IonList className="list">
                <IonItem>
                    <IonSelect
                        placeholder="Seleziona Persona"
                        value={props.visit.persona}
                    >
                        <IonSelectOption value="apples">Apples</IonSelectOption>
                        <IonSelectOption value="oranges">
                            Oranges
                        </IonSelectOption>
                        <IonSelectOption value="bananas">
                            Bananas
                        </IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonSelect
                        placeholder="Seleziona Immobile"
                        value={props.visit.immobile}
                    >
                        <IonSelectOption value="apples">Apples</IonSelectOption>
                        <IonSelectOption value="oranges">
                            Oranges
                        </IonSelectOption>
                        <IonSelectOption value="bananas">
                            Bananas
                        </IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonSelect
                        placeholder="Seleziona Agente"
                        value={props.visit.user}
                    >
                        <IonSelectOption value="apples">Apples</IonSelectOption>
                        <IonSelectOption value="oranges">
                            Oranges
                        </IonSelectOption>
                        <IonSelectOption value="bananas">
                            Bananas
                        </IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Dove</IonLabel>
                    <IonInput
                        type="text"
                        value={props.visit.dove}
                        onIonChange={(e) => inputDoveChangedHandler(e)}
                    ></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Note</IonLabel>
                    <IonTextarea
                        value={props.visit.note}
                        onIonChange={(e) => inputNoteChangedHandler(e)}
                    ></IonTextarea>
                </IonItem>
            </IonList>
        </form>
    );
};

export default FormVisit;
