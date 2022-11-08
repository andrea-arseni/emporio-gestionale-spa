import { IonButton } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import FormTextArea from "../../form-components/form-text-area/FormTextArea";
import Modal from "../Modal";

const ModalMessage: React.FC<{
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
    inputValue: string;
    inputTouchedHandler: () => void;
    inputChangedHandler: (event: any) => void;
    inputIsInvalid: boolean;
    handler: () => void;
}> = (props) => {
    return (
        <Modal
            setIsOpen={props.setModalIsOpen}
            isOpen={props.modalIsOpen}
            title={`Definisci il testo da scrivere`}
            handler={() => props.setModalIsOpen(false)}
        >
            <FormTextArea
                title="Descrizione"
                inputValue={props.inputValue}
                inputIsInvalid={props.inputIsInvalid}
                inputChangeHandler={props.inputChangedHandler}
                inputTouchHandler={props.inputTouchedHandler}
                errorMessage={"Input non valido"}
                rows={12}
            />
            <IonButton expand="full" onClick={props.handler}>
                Invia Messaggio
            </IonButton>
            <IonButton
                color="light"
                expand="full"
                onClick={() => props.setModalIsOpen(false)}
            >
                Annulla
            </IonButton>
        </Modal>
    );
};

export default ModalMessage;
