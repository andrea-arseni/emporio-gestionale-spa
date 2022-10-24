import FormGroup from "../form-group/FormGroup";
import styles from "./ItemSelector.module.css";

const ItemSelector: React.FC<{
    titoloGruppo: string;
    titoloBottone: string;
    isItemPresent: boolean;
    getItem: () => void;
    openSelector: () => void;
    simple?: boolean;
    multiple?: boolean;
    color?: boolean;
}> = (props) => {
    const bloccoItem = (
        <>
            {props.isItemPresent && props.getItem()}
            {(!props.isItemPresent || props.multiple) && (
                <button
                    color="light"
                    className={styles.button}
                    onClick={props.openSelector}
                >
                    {props.titoloBottone}
                </button>
            )}
            {props.children}
        </>
    );

    if (props.simple) return bloccoItem;

    return (
        <FormGroup
            color={
                !props.color
                    ? undefined
                    : props.isItemPresent
                    ? "success"
                    : "danger"
            }
            title={`${props.titoloGruppo} ${
                props.isItemPresent && props.color ? "presente" : "mancante"
            }`}
        >
            {bloccoItem}
        </FormGroup>
    );
};

export default ItemSelector;
