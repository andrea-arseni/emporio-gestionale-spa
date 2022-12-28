import { services } from "../../utils/services";
import { useNavigate } from "react-router-dom";
import styles from "./Servizi.module.css";
import ServiceCard from "../../components/service-card/ServiceCard";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

const ServiziPage: React.FC = () => {
    const navigate = useNavigate();

    const serviceCards = services.map((el) => (
        <IonCol size="6" className={`centered ${styles.col}`} key={el.name}>
            <ServiceCard
                message={el.title}
                onClick={() => navigate(el.name)}
                imageSrc={el.image}
            />
        </IonCol>
    ));

    return (
        <IonGrid className={`page fullHeight ${styles.container}`}>
            <IonRow className={`fullHeight centered ${styles.row}`}>
                {serviceCards}
            </IonRow>
        </IonGrid>
    );
};

export default ServiziPage;
