import { IonButton } from "@ionic/react";
import FormGroup from "../form-group/FormGroup";

const ItemSelector: React.FC<{
    titoloGruppo: string;
    titoloBottone: string;
    isItemPresent: boolean;
    getItem: () => void;
    openSelector: () => void;
    simple?: boolean;
    multiple?: boolean;
}> = (props) => {
    const bloccoItem = (
        <>
            {props.isItemPresent && props.getItem()}
            {(!props.isItemPresent || props.multiple) && (
                <IonButton
                    expand="block"
                    color="light"
                    onClick={props.openSelector}
                >
                    {props.titoloBottone}
                </IonButton>
            )}
            {props.children}
        </>
    );

    if (props.simple) return bloccoItem;

    return <FormGroup title={props.titoloGruppo}>{bloccoItem}</FormGroup>;
};

export default ItemSelector;
