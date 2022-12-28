import { IonButton } from "@ionic/react";
import { useNavigate } from "react-router-dom";
import styles from "./NoHouses.module.css";

const NoHouses: React.FC<{}> = () => {
    const navigate = useNavigate();

    return (
        <div className={`centered ${styles.wrapper}`}>
            <div className={`vertical ${styles.content}`}>
                <div className={`${styles.backdrop}`}></div>
                <h2 className={styles.text}>
                    Nessun risultato per i criteri selezionati.
                </h2>
                <div className="centered vertical">
                    <h3 className={styles.text}>
                        Prova con un altro filtro o contattaci, ti avviseremo
                        quando acquisiamo l'immobile che stai cercando!
                    </h3>
                    <div className={`centered ${styles.buttons}`}>
                        <IonButton
                            size="small"
                            onClick={() => navigate("/contattaci")}
                        >
                            Contattaci
                        </IonButton>
                        <IonButton
                            color="light"
                            size="small"
                            fill="outline"
                            onClick={() => {
                                navigate("/i-nostri-immobili");
                            }}
                        >
                            Azzera Filtro
                        </IonButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoHouses;
