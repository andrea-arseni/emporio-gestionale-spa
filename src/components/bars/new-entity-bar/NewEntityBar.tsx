import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";

const NewEntityBar: React.FC<{
    setMode: Dispatch<SetStateAction<"form" | "list">>;
    icon: string;
    title: string;
}> = (props) => {
    return (
        <IonButton
            color="primary"
            expand="full"
            mode="ios"
            fill="solid"
            style={{ margin: 0 }}
            onClick={() => (props.setMode ? props.setMode("form") : null)}
        >
            <IonIcon icon={props.icon} />
            <IonLabel style={{ paddingLeft: "16px" }}>{props.title}</IonLabel>
        </IonButton>
    );
};

export default NewEntityBar;
