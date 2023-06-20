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
    strict?: boolean;
}> = (props) => {
    const bloccoItem = (
        <>
            {props.isItemPresent && props.getItem()}
            {(!props.isItemPresent || props.multiple) && (
                <div
                    color="light"
                    className={styles.button}
                    onClick={props.openSelector}
                >
                    {props.titoloBottone}
                </div>
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
                props.strict
                    ? ""
                    : props.isItemPresent
                    ? `present${props.multiple ? "i" : "e"}`
                    : `mancant${props.multiple ? "i" : "e"}`
            }`}
        >
            {bloccoItem}
        </FormGroup>
    );
};

export default ItemSelector;
