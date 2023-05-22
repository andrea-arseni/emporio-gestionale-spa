import { IonButton } from "@ionic/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormTextArea from "../../form-components/form-text-area/FormTextArea";
import Modal from "../Modal";

const ModalMessage: React.FC<{
    url: string | undefined;
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
    inputValue: string;
    inputTouchedHandler: () => void;
    inputChangedHandler: (event: any, directValue?: string) => void;
    inputIsInvalid: boolean;
    handler: () => void;
}> = (props) => {
    const [urlAdded, setUrlAdded] = useState<boolean>(false);

    useEffect(() => {
        if (!props.modalIsOpen) setUrlAdded(false);
    }, [props.modalIsOpen]);

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
            {!urlAdded && props.url && (
                <IonButton
                    expand="full"
                    color="dark"
                    onClick={() => {
                        props.inputChangedHandler(
                            null,
                            props.inputValue + " " + props.url
                        );
                        setUrlAdded(true);
                    }}
                >
                    Aggiungi link al testo
                </IonButton>
            )}
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
