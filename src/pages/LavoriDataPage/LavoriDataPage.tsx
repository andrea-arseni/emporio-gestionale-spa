import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonLoading,
    IonTitle,
    IonToolbar,
    useIonAlert,
} from "@ionic/react";
import { arrowBackOutline, constructOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import NewEntityBar from "../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import StepForm from "../../components/forms/step-form/StepForm";
import Selector from "../../components/selector/Selector";
import { Entity } from "../../entities/entity";
import { Lavoro } from "../../entities/lavoro.model";
import { Step } from "../../entities/step.model";
import useFilterAndSort from "../../hooks/use-query-data";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import { getLavoroTitleColor } from "../../utils/statusHandler";
import styles from "./LavoriDataPage.module.css";

const LavoriDataPage: React.FC<{}> = () => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    const location = useLocation();

    const history = useHistory();

    const id = location.pathname.split("/")[2];
    const baseUrl = `/lavori/${id}/steps`;

    const [mode, setMode] = useState<"list" | "form">("list");

    const [presentAlert] = useIonAlert();

    const [currentLavoro, setCurrentLavoro] = useState<Lavoro | null>(null);

    const [currentStep, setCurrentStep] = useState<Entity | null>(null);

    const { filter, setFilter, sort, setSort, page, setPage } =
        useFilterAndSort("steps");

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
                            <IonToolbar
                                mode="ios"
                                className={styles.toolbar}
                                color={getLavoroTitleColor(
                                    currentLavoro!.status!
                                )}
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
                                    {currentLavoro!.status?.replace("_", " ")}
                                </IonTitle>
                                <IonTitle className={styles.title}>
                                    {currentLavoro!.titolo}
                                </IonTitle>
                            </IonToolbar>

                            <NewEntityBar
                                entitiesType="steps"
                                setMode={setMode}
                                icon={constructOutline}
                                title="Aggiorna Obiettivo"
                            />

                            <Selector
                                setMode={setMode}
                                entitiesType="steps"
                                setCurrentEntity={setCurrentStep}
                                baseUrl={baseUrl}
                                filter={filter}
                                setFilter={setFilter}
                                sort={sort}
                                setSort={setSort}
                                page={page}
                                setPage={setPage}
                            />
                        </>
                    )}
                </IonContent>
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
