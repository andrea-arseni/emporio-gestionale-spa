import { IonContent, IonLoading, useIonAlert } from "@ionic/react";
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
import useQueryData from "../../../hooks/use-query-data";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";

const LavoriDataPage: React.FC<{}> = () => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    const location = useLocation();

    const id = location.pathname.split("/")[2];
    const baseUrl = `/lavori/${id}/steps`;

    const [mode, setMode] = useState<"list" | "form">("list");

    const [presentAlert] = useIonAlert();

    const [currentLavoro, setCurrentLavoro] = useState<Lavoro | null>(null);

    const [currentStep, setCurrentStep] = useState<Entity | null>(null);

    const queryData = useQueryData("steps");

    useEffect(() => {
        const fetchLavoro = async () => {
            try {
                const res = await axiosInstance.get(`/lavori/${id}`);
                setCurrentLavoro(res.data);
                setShowLoading(false);
            } catch (e) {
                errorHandler(
                    e,
                    () => {},
                    "Lavoro impossibile da aprire",
                    presentAlert
                );
            }
        };

        fetchLavoro();
    }, [id, presentAlert]);

    const backToList = () => {
        setMode("list");
        setCurrentStep(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
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
                                setMode={setMode}
                                entitiesType="steps"
                                setCurrentEntity={setCurrentStep}
                                baseUrl={baseUrl}
                                queryData={queryData}
                            />
                        </>
                    )}
                </IonContent>
            )}
            {mode === "form" && (
                <IonContent>
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
                </IonContent>
            )}
        </div>
    );
};

export default LavoriDataPage;
