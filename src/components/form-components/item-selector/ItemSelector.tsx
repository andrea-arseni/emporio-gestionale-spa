import {
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonButton,
} from "@ionic/react";

const ItemSelector: React.FC<{
    titoloGruppo: string;
    titoloBottone: string;
    item: any;
    getItem: (data: any) => any;
    openSelector: () => void;
}> = (props) => {
    return (
        <IonItemGroup>
            <IonItemDivider color="dark">
                <IonLabel color="light">
                    <h2>{props.titoloGruppo}</h2>
                </IonLabel>
            </IonItemDivider>
            {props.item && props.getItem(props.item)}
            {!props.item && (
                <IonButton
                    expand="block"
                    color="light"
                    onClick={props.openSelector}
                >
                    {props.titoloBottone}
                </IonButton>
            )}
        </IonItemGroup>
    );
};

export default ItemSelector;
