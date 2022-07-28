import { IonContent, IonModal } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import Title from "../form-title/FormTitle";
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
            <IonContent className={styles.modalContent}>
                <Title
                    backToList={false}
                    title={props.title}
                    handler={props.handler}
                />
                {props.children}
            </IonContent>
        </IonModal>
    );
};

export default Modal;
