import { IonButton } from "@ionic/react";
import FormGroup from "../form-group/FormGroup";

const ItemSelector: React.FC<{
    titoloGruppo: string;
    titoloBottone: string;
    item: any;
    getItem: (data: any) => any;
    openSelector: () => void;
    simple?: boolean;
    multiple?: boolean;
}> = (props) => {
    console.log(props.item);

    if (props.simple)
        return (
            <>
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
            </>
        );

    return (
        <FormGroup title={props.titoloGruppo}>
            {(props.multiple || !props.item) && (
                <IonButton
                    expand="block"
                    color="light"
                    onClick={props.openSelector}
                >
                    {props.titoloBottone}
                </IonButton>
            )}
            {props.item && props.getItem(props.item)}
        </FormGroup>
    );
};

export default ItemSelector;
