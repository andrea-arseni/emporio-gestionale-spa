import { IonItemGroup, IonItemDivider, IonLabel } from "@ionic/react";

const FormGroup: React.FC<{ title: string; color?: string }> = (props) => {
    return (
        <IonItemGroup>
            <IonItemDivider color={props.color ? props.color : "dark"}>
                <IonLabel color="light">
                    <h2>{props.title}</h2>
                </IonLabel>
            </IonItemDivider>
            {props.children}
        </IonItemGroup>
    );
};

export default FormGroup;
