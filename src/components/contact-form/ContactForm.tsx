import React, { FormEvent, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../../hooks/use-input";
import styles from "./ContactForm.module.css";
import {
    IonButton,
    IonCheckbox,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
    useIonAlert,
} from "@ionic/react";
import { getPhoneValue } from "../../utils/numberUtils";
import axiosInstance from "../../utils/axiosInstance";
import { capitalize } from "../../utils/stringUtils";

const ContactForm: React.FC<{}> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [presentAlert] = useIonAlert();

    const formatService = (input: string) =>
        input
            .split("-")
            .map((el) => capitalize(el))
            .join(" ");

    const getNoteText = () => {
        const queryParams = location.search.substring(1).split("&");
        if (queryParams.find((el) => el.includes("immobileRef"))) {
            const ref = queryParams
                .find((el) => el.includes("immobileRef"))
                ?.split("=")[1];
            return "Interessamento all'immobile con Ref. " + ref;
        } else if (queryParams.find((el) => el.includes("servizio"))) {
            const servizio = queryParams
                .find((el) => el.includes("servizio"))
                ?.split("=")[1];
            return "Interessamento per servizio - " + formatService(servizio!);
        }

        return "Contatto generico";
    };

    const inputNameRef = useRef<HTMLIonInputElement>(null);
    const inputTelefonoRef = useRef<HTMLIonInputElement>(null);
    const inputEmailRef = useRef<HTMLIonInputElement>(null);

    const {
        inputValue: inputNameValue,
        inputIsInvalid: inputNameIsInvalid,
        inputTouchedHandler: inputNameTouchedHandler,
        inputChangedHandler: inputNameChangedHandler,
        reset: inputNameReset,
    } = useInput(
        (el) =>
            el.toString().trim().length >= 5 &&
            el.toString().trim().length <= 20
    );

    const {
        inputValue: inputTelefonoValue,
        inputIsInvalid: inputTelefonoIsInvalid,
        inputTouchedHandler: inputTelefonoTouchedHandler,
        inputChangedHandler: inputTelefonoChangedHandler,
        reset: inputTelefonoReset,
    } = useInput((el) => {
        if (!el || el.toString().trim().length === 0) return true;
        const res = getPhoneValue(el.toString());
        if (!res) return false;
        const cifre = res.toString().slice(1);
        return res.toString().length >= 9 && /^\d+$/.test(cifre);
    });

    const {
        inputValue: inputEmailValue,
        inputIsInvalid: inputEmailIsInvalid,
        inputTouchedHandler: inputEmailTouchedHandler,
        inputChangedHandler: inputEmailChangedHandler,
        reset: inputEmailReset,
    } = useInput((email) => {
        if (!email || email.toString().trim().length === 0) return true;
        const regexp = /\S+@\S+\.\S+/;
        return regexp.test(email.toString());
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [privacyChecked, setPrivacyChecked] = useState<boolean>(false);

    const privacyCheckHandler = () =>
        setPrivacyChecked((prevState) => !prevState);

    const [outlinePrivacy, setOutlinePrivacy] = useState<boolean>(false);

    const outlinePrivacyHandler = () => {
        setOutlinePrivacy(true);
        setTimeout(() => setOutlinePrivacy(false), 500);
        setTimeout(() => setOutlinePrivacy(true), 1000);
        setTimeout(() => setOutlinePrivacy(false), 1500);
    };

    const isFormInvalid =
        (inputTelefonoValue.trim() === "" && inputEmailValue.trim() === "") ||
        inputNameValue.trim() === "" ||
        inputNameIsInvalid ||
        inputEmailIsInvalid ||
        inputTelefonoIsInvalid;

    const resetForm = () => {
        inputEmailReset();
        inputNameReset();
        inputTelefonoReset();
    };

    const setNullIfEmpty = (input: string | null | undefined) =>
        !input || input.trim() === "" ? null : input.trim();

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isFormInvalid) {
            if (inputNameValue.trim() === "") {
                alert("Nome obbligatorio");
                inputNameRef.current!.setFocus();
            } else if (inputNameIsInvalid) {
                alert("Nome da correggere");
                inputNameRef.current!.setFocus();
            } else if (inputTelefonoIsInvalid) {
                alert("Telefono da correggere");
                inputTelefonoRef.current?.setFocus();
            } else if (inputEmailIsInvalid) {
                alert("Email da correggere");
                inputEmailRef.current?.setFocus();
            } else if (
                inputTelefonoValue.trim() === "" &&
                inputEmailValue.trim() === ""
            ) {
                alert("Inserire almeno uno tra telefono ed email");
                inputTelefonoRef.current?.setFocus();
            }
            return;
        }

        if (!privacyChecked) {
            outlinePrivacyHandler();
            return;
        }

        const reqBody = {
            nome: inputNameRef.current!.value?.toString().trim(),
            telefono: setNullIfEmpty(
                getPhoneValue(inputTelefonoRef.current!.value?.toString())
            ),
            email: setNullIfEmpty(
                inputEmailRef.current!.value?.toString().trim()
            ),
            note: "Contatto generico",
        };

        reqBody.note = getNoteText();

        try {
            setIsLoading(true);
            const headers = {
                recaptchaToken: process.env.REACT_APP_RECAPTCHA_KEY!,
                "Content-Type": "application/json",
            };
            await axiosInstance.post("persone/private", reqBody, { headers });
            setIsLoading(false);
            resetForm();
            privacyCheckHandler();
            presentSuccessModal();
        } catch (error: any) {
            setIsLoading(false);
            if (error.response) {
                presentErrorModal(error.response.data.message);
            } else {
                presentErrorModal("Errore, invio dati non riuscito!");
            }
        }
    };

    const presentErrorModal = (message: string) => {
        presentAlert({
            header: "Oh no!",
            message,
            buttons: [
                {
                    text: "Riprova",
                    handler: () => {
                        privacyCheckHandler();
                    },
                },
                {
                    text: "Ricomincia",
                    handler: () => {
                        privacyCheckHandler();
                        resetForm();
                    },
                },
            ],
        });
    };

    const presentSuccessModal = () => {
        presentAlert({
            header: "Ottimo!",
            message:
                "Abbiamo ricevuto la tua richiesta! Ti contatteremo appena possibile.",
            buttons: [
                {
                    text: "Chiudi",
                    handler: () => {
                        navigate(-1);
                    },
                },
            ],
        });
    };

    return (
        <div className={`centered ${styles.frame}`}>
            <IonLoading cssClass="loader" isOpen={isLoading} />
            {!isLoading && (
                <form className={`${styles.form}  centered`}>
                    <br />
                    <h5 className={styles.title}>Lasciaci un messaggio</h5>
                    <br />
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">Nome e Cognome</IonLabel>
                        <IonInput
                            type="text"
                            ref={inputNameRef}
                            onBlur={inputNameTouchedHandler}
                            onIonChange={(e) => inputNameChangedHandler(e)}
                            value={inputNameValue}
                        ></IonInput>
                        {inputNameIsInvalid && (
                            <IonNote color="danger">
                                {inputNameValue.toString().trim().length === 0
                                    ? "Obbligatorio"
                                    : inputNameValue.toString().trim().length <
                                      5
                                    ? "Troppo Corto"
                                    : "Troppo Lungo"}
                            </IonNote>
                        )}
                    </IonItem>

                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">Telefono</IonLabel>
                        <IonInput
                            type="text"
                            ref={inputTelefonoRef}
                            onBlur={inputTelefonoTouchedHandler}
                            onIonChange={(e) => inputTelefonoChangedHandler(e)}
                            value={inputTelefonoValue}
                        ></IonInput>
                        {inputTelefonoIsInvalid && (
                            <IonNote color="danger">
                                Telefono non valido
                            </IonNote>
                        )}
                    </IonItem>

                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput
                            type="text"
                            ref={inputEmailRef}
                            onBlur={inputEmailTouchedHandler}
                            onIonChange={(e) => inputEmailChangedHandler(e)}
                            value={inputEmailValue}
                        ></IonInput>
                        {inputEmailIsInvalid && (
                            <IonNote color="danger">Email non valida</IonNote>
                        )}
                    </IonItem>

                    <div
                        className={`centered ${styles.privacySection} ${
                            outlinePrivacy
                                ? styles.evidence
                                : styles.notEvidence
                        }`}
                    >
                        <div className={styles.privacyButtonArea}>
                            <IonCheckbox
                                mode="md"
                                className={styles.checkBox}
                                id="privacy"
                                onIonChange={privacyCheckHandler}
                            />
                        </div>
                        <div className={styles.privacyTextArea}>
                            <p>
                                <span style={{ fontSize: "bold" }}>
                                    Privacy:
                                </span>{" "}
                                Autorizzo al trattamento dei dati sopra
                                riportati in conformità al D.Lgs. 196/2003.
                                Maggiori info <Link to="/privacy"> qui</Link>
                            </p>
                        </div>
                    </div>
                    <IonButton onClick={submitForm}>Invia</IonButton>
                    <IonButton
                        fill="outline"
                        onClick={(e: FormEvent) => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                    >
                        Indietro
                    </IonButton>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
