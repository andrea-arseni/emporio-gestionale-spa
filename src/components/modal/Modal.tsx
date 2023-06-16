import { IonModal, isPlatform } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import { isNativeApp } from "../../utils/contactUtils";
import FormTitle from "../form-components/form-title/FormTitle";
import styles from "./Modal.module.css";

const Modal: React.FC<{
    title: string;
    handler: () => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    paddingBottom?: boolean;
}> = (props) => {
    return (
        <IonModal
            className={isNativeApp && isPlatform("ios") ? styles.iosModal : ""}
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
            <div
                className={`${styles.content} ${
                    props.paddingBottom ? styles.paddingBottom : ""
                }`}
            >
                {props.children}
            </div>
        </IonModal>
    );
};

export default Modal;
