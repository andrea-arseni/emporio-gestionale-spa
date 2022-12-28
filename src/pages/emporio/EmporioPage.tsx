import ufficioImage from "../../assets/ufficio.jpg";
import logoImage from "../../assets/logo.png";
import eccellenzaImage from "../../assets/eccellenza.png";
import fimaaImage from "../../assets/fimaa.png";
import EmporioSection from "../../components/emporio-section/EmporioSection";
import { IonButton } from "@ionic/react";
import styles from "./EmporioPage.module.css";
import { useNavigate } from "react-router-dom";

const EmporioPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    return (
        <div className={`page`}>
            <EmporioSection
                type="black"
                title="Professionisti dell'Immobiliare"
                image={logoImage}
            >
                <>
                    Benvenuto nell'App di Emporio Case!
                    <br /> Siamo un'agenzia immobiliare di Segrate (MI)
                    operativa dal 1985.
                    <br />
                    Possiamo rispondere alle più variegate domande in tema
                    immobiliare, in modo totalmente gratuito e senza impegno.
                </>
            </EmporioSection>
            <EmporioSection type="white" title="Chi Siamo" image={ufficioImage}>
                <>
                    Emporio Case Sas nasce il 15 Giugno 1985 a Milano.
                    <br />
                    Siamo specializzati in compravendite ed affitti
                    <br />
                    di immobili sia residenziali che commerciali.
                    <br />
                    Siamo iscritti al Registro delle Imprese al N° 1723681 della
                    C.C.I.A.A.
                    <br /> Partita IVA 04068690967.
                </>
            </EmporioSection>
            <EmporioSection
                type="black"
                title="Siamo associati FIMAA"
                image={fimaaImage}
            >
                <>
                    FIMAA (Federazione Italiana Mediatori ed Agenti d'Affari)
                    <br /> rappresenta un marchio di garanzia <br /> svolgendo
                    un ruolo di tutela della qualità professionale ed etica
                    degli iscritti <br /> che rispondono a requisiti severi e
                    verificabili.
                </>
            </EmporioSection>
            <EmporioSection
                type="white"
                title="I nostri partners"
                image={eccellenzaImage}
            >
                <>
                    Collaboriamo da anni con i portali <br /> più importanti del
                    settore immobiliare <br />
                    focalizzandoci sulla qualità dei nostri annunci. <br />
                    Nel 2022 siamo stati premiati con <br />
                    il certificato di eccellenza di Immobiliare.it.
                </>
            </EmporioSection>
            <IonButton
                size="small"
                className={styles.button}
                onClick={() => navigate("/contattaci")}
            >
                Contattaci
            </IonButton>
        </div>
    );
};

export default EmporioPage;

/* 
- Logo
- Presentazione
- Telefono
- Email
- Mappa
- Area riservata
*/
