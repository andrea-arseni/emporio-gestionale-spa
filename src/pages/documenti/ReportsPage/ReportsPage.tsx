import { IonList, IonLoading, useIonAlert } from "@ionic/react";
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
import styles from "./ReportsPage.module.css";
import useErrorHandler from "../../../hooks/use-error-handler";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const ReportsPage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const { errorHandler } = useErrorHandler();

    const [mode, setMode] = useState<"list" | "form">("list");

    const { list } = useList();

    const [reports, setReports] = useState<Documento[]>([]);

    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [presentAlert] = useIonAlert();

    const [showLoading, setShowLoading] = useState<boolean>(true);

    const [update, setUpdate] = useState<number>(0);

    useEffect(() => {
        let mounted = true;

        const fetchReports = async () => {
            try {
                setShowLoading(true);
                const res = await axiosInstance.get(`/reports?year=${year}`);
                if (!mounted) return;
                setShowLoading(false);
                setReports(res.data.data);
            } catch (e) {
                if (!mounted) return;
                setShowLoading(false);
                errorHandler(e, "Lettura report non riuscita");
            }
        };

        fetchReports();

        return () => {
            mounted = false;
        };
    }, [year, presentAlert, update, errorHandler]);

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
            errorHandler(e, "Creazione report non riuscita");
        }
    };

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <>
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
                            <ListDocumenti documenti={reports} />
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
            </>
        </>
    );
};

export default ReportsPage;
