import {
    useIonAlert,
    IonItem,
    IonLabel,
    IonNote,
    IonInput,
    IonLoading,
    IonButton,
    IonCheckbox,
} from "@ionic/react";
import { useState, FormEvent } from "react";
import useInput from "../../hooks/use-input";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import styles from "./ContattiPage.module.css";
import logo from "../../assets/logo.png";

const ContattiPage: React.FC<{}> = () => {
    const {
        inputValue: inputNameValue,
        inputIsInvalid: inputNameIsInvalid,
        inputIsTouched: inputNameIsTouched,
        inputTouchedHandler: inputNameTouchedHandler,
        inputChangedHandler: inputNameChangedHandler,
        reset: inputNameReset,
    } = useInput((el) => el.toString().trim().length > 3);

    const {
        inputValue: inputPhoneValue,
        inputIsInvalid: inputPhoneIsInvalid,
        inputIsTouched: inputPhoneIsTouched,
        inputTouchedHandler: inputPhoneTouchedHandler,
        inputChangedHandler: inputPhoneChangedHandler,
        reset: inputPhoneReset,
    } = useInput((el) => el.toString().trim().length > 5);

    const {
        inputValue: inputEmailValue,
        inputIsInvalid: inputEmailIsInvalid,
        inputIsTouched: inputEmailIsTouched,
        inputTouchedHandler: inputEmailTouchedHandler,
        inputChangedHandler: inputEmailChangedHandler,
        reset: inputEmailReset,
    } = useInput((el) => /\S+@\S+\.\S+/.test(el.toString()));

    const [privacyChecked, setPrivacyChecked] = useState(false);

    const privacyCheckHandler = () =>
        setPrivacyChecked((prevState) => !prevState);

    const [outlinePrivacy, setOutlinePrivacy] = useState(false);

    const outlinePrivacyHandler = () => {
        setOutlinePrivacy(true);
        setTimeout(() => setOutlinePrivacy(false), 500);
        setTimeout(() => setOutlinePrivacy(true), 1000);
        setTimeout(() => setOutlinePrivacy(false), 1500);
    };

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const formIsInvalid = () => {
        return (
            inputNameIsInvalid ||
            inputEmailIsInvalid ||
            inputPhoneIsInvalid ||
            !inputNameIsTouched ||
            (!inputEmailIsTouched && !inputPhoneIsTouched)
        );
    };

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();

        console.log(privacyChecked);

        if (!privacyChecked) {
            outlinePrivacyHandler();
            return;
        }

        setShowLoading(true);
        try {
            await axiosInstance.post(`/persone/private`, {
                nome: inputNameValue,
                email:
                    inputEmailValue && inputEmailValue.toString().length > 0
                        ? inputEmailValue
                        : null,
                telefono:
                    inputPhoneValue && inputPhoneValue.toString().length > 0
                        ? inputPhoneValue
                        : null,
            });
            setShowLoading(false);
            // call successfull, check email
            presentAlert({
                header: "Ottimo",
                subHeader: `Richiesta inviata`,
                message: `Abbiamo ricevuto la richiesta! Verrai ricontattato al più presto da un nostro operatore.`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => {
                            window.location.replace("/");
                        },
                    },
                ],
            });
        } catch (e: any) {
            setShowLoading(false);
            errorHandler(e, () => {}, `Procedura non riuscita`, presentAlert);
        }
    };

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="wrapper centered gray">
                <form className={`${styles.form} centered`}>
                    <img src={logo} alt="" className={styles.logo} />
                    <IonLabel style={{ textAlign: "center" }}>
                        {`Scrivici nome ed un contatto, telefono oppure email, e
                        verrai ricontattato da un nostro operatore appena
                        possibile`}
                    </IonLabel>
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">
                            Nome
                            {inputNameIsInvalid && (
                                <IonNote color="danger">
                                    {inputNameValue.toString().trim().length ===
                                    0
                                        ? `: Obbligatorio`
                                        : `: Troppo Corto`}
                                </IonNote>
                            )}
                        </IonLabel>
                        <IonInput
                            type="text"
                            onBlur={inputNameTouchedHandler}
                            onIonChange={(e: any) => {
                                inputNameChangedHandler(e);
                                e.target.value.toString().trim() === "" &&
                                    inputNameReset();
                            }}
                            value={inputNameValue}
                        ></IonInput>
                    </IonItem>
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">
                            Telefono
                            {inputPhoneIsInvalid && (
                                <IonNote color="danger">
                                    {inputPhoneValue.toString().trim()
                                        .length === 0
                                        ? `: Obbligatorio`
                                        : `: Troppo Corto`}
                                </IonNote>
                            )}
                        </IonLabel>
                        <IonInput
                            type="text"
                            onBlur={inputPhoneTouchedHandler}
                            onIonChange={(e: any) => {
                                inputPhoneChangedHandler(e);
                                e.target.value.toString().trim() === "" &&
                                    inputPhoneReset();
                            }}
                            value={inputPhoneValue}
                        ></IonInput>
                    </IonItem>
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">
                            Email
                            {inputEmailIsInvalid && (
                                <IonNote color="danger">{`: Valore Non Valido`}</IonNote>
                            )}
                        </IonLabel>
                        <IonInput
                            type="text"
                            onBlur={inputEmailTouchedHandler}
                            onIonChange={(e: any) => {
                                inputEmailChangedHandler(e);
                                e.target.value.toString().trim() === "" &&
                                    inputEmailReset();
                            }}
                            value={inputEmailValue}
                        ></IonInput>
                    </IonItem>
                    <div
                        className={`${styles.privacySection} ${
                            outlinePrivacy ? styles.privacySectionEvidence : ""
                        }`}
                    >
                        <IonCheckbox
                            className={styles.privacyCheckButton}
                            id="privacy"
                            onIonChange={privacyCheckHandler}
                        />
                        <p
                            className={
                                outlinePrivacy
                                    ? styles.evidence
                                    : styles.notEvidence
                            }
                        >
                            <span style={{ fontSize: "bold" }}>Privacy:</span>{" "}
                            {`Autorizzo al trattamento dei dati sopra riportati in
                            conformità al D.Lgs. 196/2003. Maggiori info `}
                            <a href="https://www.emporio-case.com?page=privacy">
                                qui
                            </a>
                        </p>
                    </div>
                    <IonButton
                        disabled={formIsInvalid()}
                        className={`${styles.button} ${styles.mainButton}`}
                        mode="ios"
                        color="primary"
                        type="button"
                        onClick={(e) => onSubmitHandler(e)}
                    >
                        Contattaci
                    </IonButton>
                </form>
            </div>
        </>
    );
};

export default ContattiPage;
