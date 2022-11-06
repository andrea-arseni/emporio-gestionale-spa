import { IonModal } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import FormTitle from "../form-components/form-title/FormTitle";
import styles from "./Modal.module.css";

const Modal: React.FC<{
    title: string;
    handler: () => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
    return (
        <IonModal
            isOpen={props.isOpen}
            showBackdrop
            onDidDismiss={() => props.setIsOpen(false)}
        >
            <FormTitle
                fixed
                backToList={false}
                title={props.title}
                handler={props.handler}
            />
            <div className={styles.content}>{props.children}</div>
        </IonModal>
    );
};

export default Modal;
