import { IonButton, IonContent, IonIcon, IonLabel } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import { entitiesType, Entity } from "../../entities/entity";
import Selector from "../selector/Selector";

const List: React.FC<{
    setMode: Dispatch<SetStateAction<"form" | "list">>;
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    entitiesType: entitiesType;
    icon: string;
    title: string;
}> = (props) => {
    return (
        <IonContent>
            <IonButton
                expand="full"
                mode="ios"
                fill="solid"
                style={{ margin: 0 }}
                onClick={() => props.setMode("form")}
            >
                <IonIcon icon={props.icon} />
                <IonLabel style={{ paddingLeft: "16px" }}>
                    {props.title}
                </IonLabel>
            </IonButton>
            <Selector
                setMode={props.setMode}
                entitiesType={props.entitiesType}
                setCurrentEntity={props.setCurrentEntity}
            />
        </IonContent>
    );
};

export default List;
