import { IonButton, IonList, IonLoading, useIonAlert } from "@ionic/react";
import { FormEvent, useState } from "react";
import { Documento } from "../../../entities/documento.model";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import {
    getFileExtension,
    getFileNameWithoutExtension,
} from "../../../utils/fileUtils";
import FormInput from "../../form-components/form-input/FormInput";

const DocumentoForm: React.FC<{
    documento: Documento | null;
    backToList: () => void;
    baseUrl: string;
}> = (props) => {
    const nome = props.documento
        ? getFileNameWithoutExtension(props.documento.nome!)
        : null;
    const estensione = props.documento
        ? getFileExtension(props.documento.nome!)
        : null;

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const {
        inputValue,
        inputIsInvalid,
        inputIsTouched,
        inputTouchedHandler,
        inputChangedHandler,
        reset,
    } = useInput(
        (e) => e.toString().length >= 5 && e.toString().length <= 40,
        nome
    );

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const nuovoNome = `${inputValue}.${estensione}`;
        setShowLoading(true);
        try {
            let reqBody = { name: nuovoNome };
            await axiosInstance.patch(
                `${props.baseUrl}/${props.documento!.id}`,
                reqBody
            );
            setShowLoading(false);
            presentAlert({
                header: "Ottimo",
                subHeader: "Nome modificato con successo",
                buttons: [
                    {
                        text: "OK",
                        handler: () => props.backToList(),
                    },
                ],
            });
        } catch (e) {
            setShowLoading(false);
            errorHandler(e, () => {}, "Procedura non riuscita", presentAlert);
        }
    };

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormInput
                    title={"Nome File (minimo 5 massimo 40 lettere)"}
                    inputValue={inputValue}
                    type={"text"}
                    inputIsInvalid={inputIsInvalid}
                    inputChangeHandler={inputChangedHandler}
                    inputTouchHandler={inputTouchedHandler}
                    errorMessage={"Lunghezza non valida"}
                    reset={reset}
                />
                <IonButton
                    expand="block"
                    disabled={
                        !inputIsTouched || (inputIsInvalid && inputIsTouched)
                    }
                    onClick={(e) => submitForm(e)}
                >
                    Rinomina File
                </IonButton>
            </IonList>
        </form>
    );
};

export default DocumentoForm;
