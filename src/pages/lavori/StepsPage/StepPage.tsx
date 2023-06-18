import { IonButton, IonIcon } from "@ionic/react";
import {
    createOutline,
    trashBinOutline,
    backspaceOutline,
} from "ionicons/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormTextArea from "../../../components/form-components/form-text-area/FormTextArea";
import SinglePageData from "../../../components/single-page-component/SinglePageData";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useDeleteEntity from "../../../hooks/use-delete-entity";
import useErrorHandler from "../../../hooks/use-error-handler";
import useInput from "../../../hooks/use-input";
import { changeLoading } from "../../../store/ui-slice";
import axiosInstance from "../../../utils/axiosInstance";
import { isUserAdmin } from "../../../utils/userUtils";

const StepPage: React.FC<{}> = () => {
    const currentLavoro = useAppSelector((state) => state.lavoro.currentLavoro);
    const currentStep = useAppSelector((state) => state.steps.currentStep);

    const dispatch = useAppDispatch();

    const [clickBlocked, setClickBlocked] = useState<boolean>(true);

    useEffect(() => {
        const timeout: NodeJS.Timeout = setTimeout(() => {
            setClickBlocked(false);
        }, 1000);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    let eventDescription =
        currentStep && currentStep.descrizione ? currentStep.descrizione : null;

    if (
        currentStep &&
        currentStep.descrizione &&
        currentStep.descrizione.indexOf("[") === 0 &&
        currentStep.descrizione.includes("]")
    ) {
        eventDescription = currentStep.descrizione.split("]")[1].trim();
    }

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
        reset: inputNoteReset,
    } = useInput(() => true, eventDescription);

    const { errorHandler } = useErrorHandler();

    const submitForm = async () => {
        if (clickBlocked) return;
        try {
            dispatch(changeLoading(true));
            await axiosInstance.patch(
                `/lavori/${currentLavoro!.id}/steps/${currentStep!.id}`,
                { descrizione: inputNoteValue.trim() }
            );
            dispatch(changeLoading(false));
            navigateBack();
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(e, "Modifica evento non riuscita");
        }
    };

    const navigate = useNavigate();
    const navigateBack = () => navigate(-1);

    const userData = useAppSelector((state) => state.auth.userData);

    const { deleteEntity } = useDeleteEntity();

    return (
        <div className="singlePageFrame">
            <div className="singlePageInnerFrame">
                <SinglePageData chiave="Descrizione Passaggio" />
                <FormTextArea
                    autofocus
                    inputValue={inputNoteValue}
                    inputIsInvalid={inputNoteIsInvalid}
                    inputChangeHandler={inputNoteChangedHandler}
                    inputTouchHandler={inputNoteTouchedHandler}
                    errorMessage={"Input non valido"}
                    reset={inputNoteReset}
                />
                <IonButton
                    className="singlePageGeneralButton"
                    color="primary"
                    mode="ios"
                    fill="solid"
                    disabled={
                        inputNoteValue === eventDescription ||
                        inputNoteValue.toString().trim().length === 0
                    }
                    onClick={submitForm}
                >
                    <IonIcon className="rightSpace" icon={createOutline} />
                    Modifica descrizione
                </IonButton>
                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        mode="ios"
                        fill="solid"
                        onClick={() =>
                            deleteEntity(
                                `lavori/${currentLavoro?.id}/steps`,
                                currentStep?.id?.toString()!
                            )
                        }
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella Step
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="medium"
                    mode="ios"
                    fill="solid"
                    onClick={navigateBack}
                >
                    <IonIcon className="rightSpace" icon={backspaceOutline} />
                    Torna Indietro
                </IonButton>
            </div>
        </div>
    );
};

export default StepPage;
