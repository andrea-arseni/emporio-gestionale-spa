import { IonCol, IonGrid, IonRow } from "@ionic/react";
import ContactForm from "../../components/contact-form/ContactForm";
import styles from "./Contattaci.module.css";

const Contattaci: React.FC<{}> = () => {
    return (
        <IonGrid
            className={`text-center fullHeight centered ${styles.gradient}`}
        >
            <IonRow className={`centered fullHeight`}>
                <IonCol className={`centered fullHeight`}>
                    <ContactForm />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Contattaci;
