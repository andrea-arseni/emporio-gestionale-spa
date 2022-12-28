import { IonCol, IonGrid, IonRow } from "@ionic/react";
import Map from "../../components/map/Map";
import styles from "./ContattiPage.module.css";

const Contatti: React.FC = () => {
    return (
        <IonGrid
            className={`text-center centered fullHeight ${styles.contatti}`}
        >
            <IonRow className={`text-center centered fullHeight`}>
                <IonCol size="12" className={`${styles.mapCol}`}>
                    <div
                        className={`vertical centered fullHeight ${styles.dati} `}
                    >
                        <p>
                            <i className="bi bi-shop rightSpace"></i>Indirizzo
                            Sede
                            <br />
                            <span className={styles.content}>
                                Via Gramsci, 34 - 20054 Segrate (MI)
                            </span>
                        </p>
                        <p>
                            <i className="bi bi-clock rightSpace"></i>Orari di
                            Apertura
                            <br />
                            <span className={styles.content}>
                                Da Lunedì a Venerdì:
                                <br /> 09.30-13.00 e 15.00-18.30
                                <br />
                                Sabato: 09.30-12.30
                            </span>
                        </p>
                        <p>
                            <i className={`rightSpace bi bi-telephone`}></i>
                            Telefono
                            <br />
                            <span className={styles.content}>
                                <a href="tel:0226922027">02 2692 2027</a>
                            </span>
                        </p>
                        <p>
                            <i className={`rightSpace bi bi-envelope`}></i>
                            Email
                            <br />
                            <span className={styles.content}>
                                <a href="mailto:info@emporiocase.com">
                                    emporiocase@emporiocase.com
                                </a>
                            </span>
                        </p>
                        <p>
                            <i className="rightSpace bi bi-whatsapp"></i>Numero
                            WhatsApp
                            <br />
                            <span className={styles.content}>
                                <a href="tel:3517035998">+39 351 7035 998</a>
                            </span>
                        </p>
                    </div>
                    <Map />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Contatti;
