import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonText,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { Immobile } from "../../entities/immobile.model";
import { numberAsPrice } from "../../utils/numberAsPrice";
import styles from "./Lists.module.css";

const ListImmobili: React.FC<{ immobili: Immobile[] }> = (props) => {
    return (
        <>
            {props.immobili.map((immobile: Immobile) => (
                <IonItemSliding key={immobile.id!} id={immobile.id?.toString()}>
                    <IonItem detail>
                        <h3
                            className={`${styles.ref} ${
                                immobile.status === "ATTIVO"
                                    ? styles.active
                                    : styles.inactive
                            }`}
                        >
                            {immobile.ref}
                        </h3>
                        <IonLabel>
                            <h2>{immobile.titolo} </h2>
                            <p>{`${immobile.indirizzo} (${immobile.comune})`}</p>
                            <p>
                                <span
                                    style={{
                                        color: "#4C8CFF",
                                        marginRight: "10px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {numberAsPrice(immobile.prezzo!)}
                                </span>
                                {immobile.superficie} mq
                            </p>
                        </IonLabel>
                        <IonNote slot="end" className={styles.note}>
                            {immobile.contratto?.toUpperCase()}
                            <br />
                            {immobile.categoria?.toUpperCase()}
                        </IonNote>
                    </IonItem>
                    <IonItemOptions side="end">
                        <IonItemOption color="warning">
                            <div className="itemOption">
                                <IonIcon icon={createOutline} size="large" />
                                <IonText>Modifica</IonText>
                            </div>
                        </IonItemOption>
                        <IonItemOption color="danger">
                            <div className="itemOption">
                                <IonIcon icon={trashOutline} size="large" />
                                <IonText>Elimina</IonText>
                            </div>
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListImmobili;
