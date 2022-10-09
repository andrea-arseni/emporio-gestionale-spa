import styles from "./ImmobileDataPage.module.css";
import {
    IonButton,
    IonContent,
    IonIcon,
    IonLoading,
    useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Immobile } from "../../../entities/immobile.model";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import Card from "../../../components/card/Card";
import { arrowBackOutline, bookOutline, cameraOutline } from "ionicons/icons";

const ImmobileDataPage: React.FC<{}> = () => {
    const location = useLocation();

    const history = useHistory();

    const [showLoading, setShowLoading] = useState<boolean>(true);

    const [presentAlert] = useIonAlert();

    const [immobile, setImmobile] = useState<Immobile | null>(null);

    useEffect(() => {
        const getImmobile = async () => {
            const id = location.pathname.split("/")[2];
            try {
                const resImmobile = await axiosInstance.get(`/immobili/${id}`);
                setImmobile(resImmobile.data as Immobile);
                setShowLoading(false);
            } catch (e) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => history.goBack(),
                    "Immobile impossibile da aprire",
                    presentAlert
                );
            }
        };

        getImmobile();
    }, [location, history, presentAlert]);

    const inquilini =
        !immobile || !immobile.inquilini || immobile.inquilini.length === 0 ? (
            <h3>Immobile senza inquilini</h3>
        ) : (
            immobile.inquilini.map((el, index) => (
                <Card
                    key={el.id}
                    subTitle={`Inquilino ${++index}`}
                    title={el.nome ? el.nome : "Non indicato"}
                    phone={el.telefono ? el.telefono : undefined}
                    email={el.email ? el.email : undefined}
                ></Card>
            ))
        );

    return (
        <IonContent className="page">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className={styles.titolo}>
                <IonIcon
                    icon={arrowBackOutline}
                    className="arrowBack"
                    onClick={() => history.goBack()}
                />
                <h3>{immobile?.titolo}</h3>
                <div></div>
            </div>
            {immobile && (
                <>
                    <section className={styles.section}>
                        <Card
                            subTitle={"Proprietario"}
                            title={
                                immobile.proprietario &&
                                immobile.proprietario.nome
                                    ? immobile.proprietario.nome
                                    : "Non indicato"
                            }
                            phone={
                                immobile.proprietario &&
                                immobile.proprietario.telefono
                                    ? immobile.proprietario.telefono
                                    : undefined
                            }
                            email={
                                immobile.proprietario &&
                                immobile.proprietario.email
                                    ? immobile.proprietario.email
                                    : undefined
                            }
                        />
                    </section>
                    <section className={styles.section}>{inquilini}</section>
                    <IonButton
                        className={styles.button}
                        expand="block"
                        color="warning"
                        onClick={() => {
                            history.push(`/immobili/${immobile.id}/storia`);
                        }}
                    >
                        <IonIcon slot="start" icon={bookOutline}></IonIcon>
                        Storia immobile
                    </IonButton>
                    <IonButton
                        className={styles.button}
                        expand="block"
                        onClick={() => {}}
                    >
                        <IonIcon slot="start" icon={cameraOutline}></IonIcon>
                        File e Foto
                    </IonButton>
                </>
            )}
        </IonContent>
    );
};

export default ImmobileDataPage;
