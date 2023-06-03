import { IonLoading, useIonAlert } from "@ionic/react";
import { constructOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import RiepilogoBar from "../../../components/bars/riepilogo-bar/RiepilogoBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import StepForm from "../../../components/forms/step-form/StepForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Lavoro } from "../../../entities/lavoro.model";
import { Step } from "../../../entities/step.model";
import axiosInstance from "../../../utils/axiosInstance";
import useErrorHandler from "../../../hooks/use-error-handler";

const LavoriDataPage: React.FC<{}> = () => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    const location = useLocation();

    const id = location.pathname.split("/")[2];
    const baseUrl = `/lavori/${id}/steps`;

    const [mode, setMode] = useState<"list" | "form">("list");

    const [presentAlert] = useIonAlert();

    const [currentLavoro, setCurrentLavoro] = useState<Lavoro | null>(null);

    const [currentStep, setCurrentStep] = useState<Entity | null>(null);

    const { errorHandler } = useErrorHandler();

    useEffect(() => {
        let mounted = true;

        const fetchLavoro = async () => {
            try {
                const res = await axiosInstance.get(`/lavori/${id}`);
                if (!mounted) return;
                setCurrentLavoro(res.data);
                setShowLoading(false);
            } catch (e) {
                setShowLoading(false);
                if (!mounted) return;
                errorHandler(e, "Lavoro impossibile da aprire", true);
            }
        };

        fetchLavoro();

        return () => {
            mounted = false;
        };
    }, [id, presentAlert, errorHandler]);

    const backToList = () => {
        setMode("list");
        setCurrentStep(null);
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <IonLoading cssClass="loader" isOpen={showLoading} />
                    {currentLavoro && (
                        <>
                            <RiepilogoBar
                                currentEntity={currentLavoro}
                                tipologia={"lavoro"}
                            />

                            <NewEntityBar
                                setMode={setMode}
                                icon={constructOutline}
                                title="Aggiorna Obiettivo"
                            />

                            <Selector
                                localQuery
                                setMode={setMode}
                                entitiesType="steps"
                                setCurrentEntity={setCurrentStep}
                                baseUrl={baseUrl}
                            />
                        </>
                    )}
                </>
            )}
            {mode === "form" && (
                <>
                    <div>
                        <FormTitle
                            title={
                                currentStep?.id
                                    ? "Modifica Aggiornamento"
                                    : "Nuovo Aggiornamento"
                            }
                            handler={backToList}
                            backToList
                        />
                    </div>

                    <div>
                        <StepForm
                            lavoro={currentLavoro as Lavoro}
                            setCurrentLavoro={setCurrentLavoro}
                            step={currentStep as Step}
                            backToList={backToList}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default LavoriDataPage;
