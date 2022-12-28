import { services } from "../../utils/services";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./Servizio.module.css";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";

const Servizio: React.FC<{}> = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const key = location.pathname.split("/").pop();

    let serviceTitle = null;
    let serviceMessage = null;

    const service = services.find((el) => el.name === key);
    try {
        serviceTitle = (
            <h2 style={{ fontWeight: "lighter" }}>{service!.title}</h2>
        );
        const textArray = service!.message;
        serviceMessage = textArray.map((el, index) => <p key={index}>{el}</p>);
    } catch (e) {
        return <Navigate to="/" />;
    }

    const goToContattaciPage = () =>
        navigate(`/contattaci?servizio=${service?.name}`);

    return (
        <IonGrid className={`centered ${styles.container}`}>
            <img
                alt="Non disponibile"
                src={service?.image}
                className={`fullHeight fullWidth ${styles.image}`}
            />
            <IonRow className={`fullHeight ${styles.row}`}>
                <IonCol className="centered" size="12">
                    <div className={`vertical centered ${styles.dati} `}>
                        {serviceTitle}
                        <br />
                        {serviceMessage}
                        <br />
                        <IonButton
                            className={styles.button}
                            size="small"
                            type="button"
                            onClick={() => goToContattaciPage()}
                        >
                            Ti interessa? Contattaci
                        </IonButton>
                    </div>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Servizio;
