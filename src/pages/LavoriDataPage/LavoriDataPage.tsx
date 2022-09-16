import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonTitle,
    IonToolbar,
    useIonAlert,
} from "@ionic/react";
import { arrowBackOutline, constructOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import StepForm from "../../components/forms/step-form/StepForm";
import List from "../../components/list/List";
import { Entity } from "../../entities/entity";
import { Lavoro } from "../../entities/lavoro.model";
import { Step } from "../../entities/step.model";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import { getLavoroTitleColor } from "../../utils/getLavoroTitleColor";
import styles from "./LavoriDataPage.module.css";

const LavoriDataPage: React.FC<{}> = () => {
    const location = useLocation();

    const history = useHistory();

    const id = location.pathname.split("/")[2];
    const baseUrl = `/lavori/${id}/steps`;

    const [mode, setMode] = useState<"list" | "form">("list");

    const [presentAlert] = useIonAlert();

    const [currentLavoro, setCurrentLavoro] = useState<Lavoro | null>(null);

    const [currentStep, setCurrentStep] = useState<Entity | null>(null);

    useEffect(() => {
        const fetchLavoro = async () => {
            try {
                const res = await axiosInstance.get(`/lavori/${id}`);
                setCurrentLavoro(res.data);
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
                <>
                    {currentLavoro && (
                        <IonToolbar
                            mode="ios"
                            className={styles.toolbar}
                            color={getLavoroTitleColor(currentLavoro.status!)}
                        >
                            <IonButtons slot="start">
                                <IonButton onClick={() => history.goBack()}>
                                    <IonIcon
                                        slot="icon-only"
                                        icon={arrowBackOutline}
                                    />
                                </IonButton>
                            </IonButtons>
                            <IonTitle
                                size="small"
                                className={styles.smallTitle}
                            >
                                {currentLavoro.status?.replace("_", " ")}
                            </IonTitle>
                            <IonTitle className={styles.title}>
                                {currentLavoro.titolo}
                            </IonTitle>
                        </IonToolbar>
                    )}
                    <List
                        setMode={setMode}
                        setCurrentEntity={setCurrentStep}
                        entitiesType="steps"
                        icon={constructOutline}
                        title="Aggiorna Obiettivo"
                        baseUrl={baseUrl}
                    />
                </>
            )}
            {mode === "form" && (
                <IonContent>
                    <div className={styles.fixed}>
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
                    <div className={styles.spaceDown}>
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
