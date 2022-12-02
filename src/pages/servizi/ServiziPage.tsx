import {
    IonItem,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonThumbnail,
} from "@ionic/react";
import { peopleOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import ItemOption from "../../components/lists/ItemOption";
import useWindowSize from "../../hooks/use-size";
import { service, services } from "../../utils/services";
import styles from "./ServiziPage.module.css";

const ServiziPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const [width] = useWindowSize();

    const getMessages = (servizio: service) => {
        return (
            <div className={styles.messages}>
                {servizio.message.map((el) => (
                    <p key={el.substring(0, 30)}>{el}</p>
                ))}
            </div>
        );
    };

    const getServizioLowWidth = (servizio: service) => {
        return (
            <IonItem detail>
                <div className="centered vertical">
                    <div className={styles.title}>
                        <IonThumbnail className={styles.frame}>
                            <img
                                className={styles.image}
                                src={servizio.image}
                                alt="foto"
                            />
                        </IonThumbnail>
                        <IonLabel text-wrap>
                            <h3>{servizio.title}</h3>
                        </IonLabel>
                        <div></div>
                    </div>
                    <div>{getMessages(servizio)}</div>
                </div>
            </IonItem>
        );
    };

    const getServizioHighWidth = (servizio: service) => {
        return (
            <IonItem detail>
                <IonThumbnail className={styles.frame}>
                    <img
                        className={styles.image}
                        src={servizio.image}
                        alt="foto"
                    />
                </IonThumbnail>
                <IonLabel text-wrap>
                    <h3>{servizio.title}</h3>
                    <div>{getMessages(servizio)}</div>
                </IonLabel>
            </IonItem>
        );
    };

    const getServizioCompleto = (servizio: service) => {
        return (
            <IonItemSliding key={servizio.id}>
                {width <= 550
                    ? getServizioLowWidth(servizio)
                    : getServizioHighWidth(servizio)}
                <IonItemOptions side="end">
                    <ItemOption
                        handler={() => navigate("/contattaci")}
                        colorType={"primary"}
                        icon={peopleOutline}
                        title={"chiedi"}
                    />
                </IonItemOptions>
            </IonItemSliding>
        );
    };

    return (
        <div>
            {services.map((element: service) => getServizioCompleto(element))}
        </div>
    );
};

export default ServiziPage;
