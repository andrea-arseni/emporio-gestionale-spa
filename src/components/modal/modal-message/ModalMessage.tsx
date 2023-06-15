import { IonButton, IonIcon } from "@ionic/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormTextArea from "../../form-components/form-text-area/FormTextArea";
import Modal from "../Modal";
import {
    arrowBackCircleOutline,
    attachOutline,
    logoWhatsapp,
    shareOutline,
} from "ionicons/icons";
import useWhatsApp from "../../../hooks/use-whatsapp";
import { useAppSelector } from "../../../hooks";

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

    const persona = useAppSelector((state) => state.persona.persona);

    useEffect(() => {
        if (!props.modalIsOpen) setUrlAdded(false);
    }, [props.modalIsOpen]);

    const { whatsAppAvailable, sendWhatsapp } = useWhatsApp(
        persona?.telefono!,
        props.inputValue
    );

    return (
        <Modal
            setIsOpen={props.setModalIsOpen}
            isOpen={props.modalIsOpen}
            title={`Definisci il testo da scrivere`}
            handler={() => props.setModalIsOpen(false)}
        >
            <div className="singlePageFrame">
                <div className="singlePageInnerFrame">
                    <h5 style={{ color: "black" }}>Messaggio</h5>
                    <FormTextArea
                        inputValue={props.inputValue}
                        inputIsInvalid={props.inputIsInvalid}
                        inputChangeHandler={props.inputChangedHandler}
                        inputTouchHandler={props.inputTouchedHandler}
                        errorMessage={"Input non valido"}
                        rows={12}
                    />

                    <IonButton
                        className="singlePageGeneralButton"
                        color="primary"
                        mode="ios"
                        fill="solid"
                        onClick={props.handler}
                    >
                        <IonIcon className="rightSpace" icon={shareOutline} />
                        Invia Messaggio
                    </IonButton>

                    {whatsAppAvailable && (
                        <IonButton
                            className="singlePageGeneralButton"
                            color="success"
                            mode="ios"
                            fill="solid"
                            onClick={sendWhatsapp}
                        >
                            <IonIcon
                                className="rightSpace"
                                icon={logoWhatsapp}
                            />
                            Invia su WhatsApp
                        </IonButton>
                    )}
                    {!urlAdded && props.url && (
                        <IonButton
                            className="singlePageGeneralButton"
                            mode="ios"
                            fill="solid"
                            color="dark"
                            onClick={() => {
                                props.inputChangedHandler(
                                    null,
                                    props.inputValue + " " + props.url
                                );
                                setUrlAdded(true);
                            }}
                        >
                            <IonIcon
                                className="rightSpace"
                                icon={attachOutline}
                            />
                            Aggiungi link al testo
                        </IonButton>
                    )}
                    <IonButton
                        className="singlePageGeneralButton"
                        mode="ios"
                        fill="solid"
                        color="medium"
                        onClick={() => props.setModalIsOpen(false)}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={arrowBackCircleOutline}
                        />
                        Annulla
                    </IonButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalMessage;
