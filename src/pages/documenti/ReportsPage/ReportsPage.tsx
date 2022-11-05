import { IonContent, IonList, IonLoading, useIonAlert } from "@ionic/react";
import { podiumOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import ArrowsBar from "../../../components/bars/arrows-bar/ArrowsBar";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import Card from "../../../components/card/Card";
import ListDocumenti from "../../../components/lists/ListDocumenti";
import PageFooter from "../../../components/page-footer/PageFooter";
import TwoDates from "../../../components/two-dates/TwoDates";
import { Documento } from "../../../entities/documento.model";
import useList from "../../../hooks/use-list";
import axiosInstance from "../../../utils/axiosInstance";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import errorHandler from "../../../utils/errorHandler";
import styles from "./ReportsPage.module.css";

const ReportsPage: React.FC<{}> = (props) => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const { list, closeItemsList } = useList();

    const [reports, setReports] = useState<Documento[]>([]);

    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [presentAlert] = useIonAlert();

    const [showLoading, setShowLoading] = useState<boolean>(true);

    const [update, setUpdate] = useState<number>(0);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setShowLoading(true);
                const res = await axiosInstance.get(`/reports?year=${year}`);
                setShowLoading(false);
                setReports(res.data.data);
            } catch (e) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => {},
                    "Lettura report non riuscita",
                    presentAlert
                );
            }
        };

        fetchReports();
    }, [year, presentAlert, update]);

    const confirmDeleteEntity = async (id: string) => {
        const url = `/documenti/${id}`;
        try {
            setShowLoading(true);
            await axiosInstance.delete(url);
            setShowLoading(false);
            setUpdate((oldNumber) => ++oldNumber);
        } catch (e) {
            setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Eliminazione non riuscita",
                presentAlert
            );
        }
    };

    const deleteEntity = (entityName: string, id: string, message?: string) => {
        presentAlert({
            header: "Attenzione!",
            subHeader: message ? message : "La cancellazione è irreversibile.",
            buttons: [
                {
                    text: "Conferma",
                    handler: () => confirmDeleteEntity(id),
                },
                {
                    text: "Indietro",
                    handler: () => closeItemsList(),
                },
            ],
        });
    };

    const creaReport = async (input: any) => {
        const url = `/report`;
        const reqBody = { from: input.startDate, to: input.endDate };
        try {
            setShowLoading(true);
            await axiosSecondaryApi.post(url, reqBody);
            setShowLoading(false);
            setMode("list");
            setUpdate((oldNumber) => ++oldNumber);
        } catch (e) {
            setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Creazione report non riuscita",
                presentAlert
            );
        }
    };

    return (
        <div className="page">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonContent>
                <NewEntityBar
                    setMode={setMode}
                    icon={podiumOutline}
                    title="Nuovo Report"
                />
                {mode === "list" && (
                    <>
                        <ArrowsBar
                            moveBackward={() =>
                                setYear((prevYear) => --prevYear)
                            }
                            moveForward={() =>
                                setYear((prevYear) => ++prevYear)
                            }
                            titolo={year.toString()}
                        />
                        <IonList ref={list} className={styles.list}>
                            <ListDocumenti
                                documenti={reports}
                                deleteEntity={deleteEntity}
                                setShowLoading={setShowLoading}
                                setUpdate={setUpdate}
                                baseUrl={`/documenti`}
                                closeItems={closeItemsList}
                            />
                            {reports.length === 0 && (
                                <Card
                                    subTitle={`Questo immobile non ha report associati`}
                                    title={"Non sono ancora presenti report"}
                                />
                            )}
                        </IonList>
                        {reports.length > 0 && (
                            <PageFooter
                                numberOfResults={reports.length}
                                simple
                            />
                        )}
                    </>
                )}
                {mode === "form" && (
                    <TwoDates
                        action={creaReport}
                        text="Crea Report"
                        limit={new Date()}
                        goBack
                        getBack={() => setMode("list")}
                    />
                )}
            </IonContent>
        </div>
    );
};

export default ReportsPage;
