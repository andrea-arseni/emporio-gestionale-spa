import { IonButton, IonList, IonLoading } from "@ionic/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Documento } from "../../../entities/documento.model";
import { useAppDispatch } from "../../../hooks";
import useInput from "../../../hooks/use-input";
import { renameFile } from "../../../store/immobile-slice";
import axiosInstance from "../../../utils/axiosInstance";
import {
    getFileExtension,
    getFileNameWithoutExtension,
} from "../../../utils/fileUtils";
import FormInput from "../../form-components/form-input/FormInput";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";

const DocumentoForm: React.FC<{
    documento: Documento | null;
    backToList: () => void;
    baseUrl: string;
}> = (props) => {
    const dispatch = useAppDispatch();

    const nome = props.documento
        ? getFileNameWithoutExtension(props.documento.nome!)
        : null;
    const estensione = props.documento
        ? getFileExtension(props.documento.nome!)
        : null;

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [nameUpdated, isNameUpdated] = useState<boolean>(false);

    const { hasBeenClicked, setHasBeenClicked } = useSingleClick();

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

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
        await eseguiForm();
    };

    const eseguiForm = useCallback(async () => {
        const nuovoNome = `${inputValue}.${estensione}`;
        setShowLoading(true);
        try {
            let reqBody = { name: nuovoNome };
            await axiosInstance.patch(
                `${props.baseUrl}/${props.documento!.id}`,
                reqBody
            );
            setShowLoading(false);
            isNameUpdated(true);
            presentAlert({
                header: "Ottimo",
                subHeader: "Nome modificato con successo",
                buttons: [
                    {
                        text: "OK",
                        handler: () => {
                            if (props.baseUrl.includes("immobili"))
                                dispatch(
                                    renameFile({
                                        id: props.documento!.id!,
                                        newName: nuovoNome,
                                    })
                                );
                            props.backToList();
                        },
                    },
                ],
            });
        } catch (e) {
            setShowLoading(false);
            errorHandler(e, "Procedura non riuscita");
        }
    }, [dispatch, errorHandler, estensione, inputValue, presentAlert, props]);

    const isFormInvalid = !inputIsTouched || (inputIsInvalid && inputIsTouched);

    useEffect(() => {
        const inputIsValid =
            inputValue.toString().length >= 5 &&
            inputValue.toString().length <= 40;

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (e.key === "Enter" && !isError && inputIsValid) {
                setHasBeenClicked(true);
                if (nameUpdated) {
                    hideAlert();
                    props.backToList();
                } else if (hasBeenClicked) {
                    await eseguiForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [
        inputValue,
        hideAlert,
        props,
        nameUpdated,
        isError,
        eseguiForm,
        hasBeenClicked,
        setHasBeenClicked,
    ]);

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormInput
                    autofocus
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
                    onKeyDown={(e) => e.preventDefault()}
                    expand="block"
                    disabled={isFormInvalid}
                    onClick={(e) => submitForm(e)}
                >
                    Rinomina File
                </IonButton>
            </IonList>
        </form>
    );
};

export default DocumentoForm;
