import { IonLabel } from "@ionic/react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./EmporioPage.module.css";

const EmporioPage: React.FC<{}> = () => {
    return (
        <div className={`centered vertical ${styles.background}`}>
            <img src={logo} alt="" className={styles.logo} />
            <div className={`${styles.text}`}>
                <h3>Chi Siamo</h3>
                <p>
                    {`Emporio Case nasce il 15 Giugno 1985 a Milano.`}
                    <br />
                    {`Siamo specializzati in compravendite ed affitti`} <br />
                    {`di immobili residenziale e commerciali.`}
                    <br />
                    {`Iscrizione al Registro delle Imprese n. 1723681 della CCIAA.`}
                    <br /> {`Partita IVA 04068690967.`}
                </p>
            </div>
            <div className={styles.text}>
                <h3>I Nostri Contatti</h3>
                <p>
                    Telefono: <a href={`tel:0226922027`}>0226922027</a>
                    <br />
                    <br />
                    Email:{" "}
                    <a href={`mailto:info@emporiocase.com`}>
                        info@emporiocase.com
                    </a>
                    <br />
                    <br />
                    Indirizzo:{" "}
                    <a href="https://www.google.com/maps/place/Via+Gramsci,+34,+20090+Segrate+MI">
                        {`Via Gramsci, 34 - Segrate (MI)`}
                    </a>
                </p>
                <NavLink to={"/contattaci"} className={styles.button}>
                    <IonLabel>Contattaci Subito</IonLabel>
                </NavLink>
            </div>

            <div className={styles.text}>
                <h3>Siamo associati FIMAA </h3>
                <p>
                    {`FIMAA (Federazione Italiana Mediatori ed Agenti d'Affari)`}
                    <br /> {`rappresenta un marchio di garanzia`} <br />{" "}
                    {`svolgendo
                    un ruolo di tutela della qualità professionale ed etica
                    degli iscritti`}{" "}
                    <br />{" "}
                    {`che rispondono a requisiti severi e
                    verificabili.`}
                </p>
            </div>
            <div className={styles.text}>
                <h3>I Nostri Partners</h3>
                <p>
                    {`Collaboriamo da anni con i portali`} <br />{" "}
                    {`più importanti del
                    settore immobiliare`}{" "}
                    <br />
                    {`focalizzandoci sulla qualità dei nostri annunci.`} <br />
                    {`Nel 2022 siamo stati premiati con la consegna`}
                    <br />
                    {`del certificato di eccellenza di Immobiliare.it.`}
                </p>
            </div>
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
