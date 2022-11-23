import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
    useIonAlert,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAppDispatch } from "../../../hooks";
import useInput from "../../../hooks/use-input";
import { performLogin } from "../../../store/auth-thunk";
import axiosInstance from "../../../utils/axiosInstance";
import capitalize from "../../../utils/capitalize";
import styles from "./PasswordPage.module.css";

const PasswordPage: React.FC<{}> = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [presentAlert] = useIonAlert();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const mode = location.pathname.substring(1).replace("-", " ");

    const {
        inputValue: inputPasswordValue,
        inputIsInvalid: inputPasswordIsInvalid,
        inputTouchedHandler: inputPasswordTouchedHandler,
        inputChangedHandler: inputPasswordChangedHandler,
        reset: inputPasswordReset,
    } = useInput((el) => el.toString().trim().length > 7);

    const {
        inputValue: inputConfirmPasswordValue,
        inputIsInvalid: inputConfirmPasswordIsInvalid,
        inputTouchedHandler: inputConfirmPasswordTouchedHandler,
        inputChangedHandler: inputConfirmPasswordChangedHandler,
        reset: inputConfirmPasswordReset,
    } = useInput((el) => el.toString().trim().length > 7);

    const formIsInvalid =
        inputPasswordIsInvalid ||
        inputConfirmPasswordIsInvalid ||
        inputPasswordValue.trim() === "" ||
        inputConfirmPasswordValue.trim() === "";

    const resetForm = () => {
        inputPasswordReset();
        inputConfirmPasswordReset();
    };

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        let errorMessage = null;
        // prendi le due query string params, se non ci sono alert errore link invalido
        const queryStrings: string[] = location.search.substring(1).split("&");
        let token = queryStrings.find((el) => el.startsWith("token="));
        if (token) token = token.substring(6);
        let id = queryStrings.find((el) => el.startsWith("id="));
        if (id) id = id.substring(3);
        if (!token || !id) errorMessage = "Link invalido, operazione annullata";
        // check le passwords, se non ci coincidono alert errore passwords
        if (inputPasswordValue !== inputConfirmPasswordValue)
            errorMessage = "Passwords non coincidenti, operazione annullata";
        if (errorMessage) {
            presentAlert({
                header: "Errore",
                message: errorMessage,
                buttons: [
                    {
                        text: "OK",
                        handler: () => resetForm(),
                    },
                ],
            });
        }
        // axios call con gestione errore es. id sbagliato
        // success - login e redirect su appuntamenti
        setShowLoading(true);
        try {
            const res = await axiosInstance.post(
                `users/${
                    mode === "rinnova password"
                        ? "reset-password"
                        : "first-access"
                }`,
                {
                    confirmPassword: inputConfirmPasswordValue,
                    password: inputPasswordValue,
                    id,
                    originalToken: token,
                }
            );
            setShowLoading(false);
            const userData = res.data;
            // salva il token in global state
            // salva il token in localstorage
            // dichiara che sei entrato
            dispatch(performLogin(userData));
        } catch (e: any) {
            setShowLoading(false);
            presentAlert({
                header: "Errore",
                message: `${
                    e.response
                        ? e.response.data.message
                        : `${
                              mode === "rinnova password"
                                  ? "Richiesta rinnovo password"
                                  : "Richiesta primo accesso"
                          } non riuscita`
                }`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => resetForm(),
                    },
                ],
            });
        }
    };

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="wrapper centered gray">
                <form
                    className={`${styles.form} centered`}
                    onSubmit={(e) => onSubmitHandler(e)}
                >
                    <img src={logo} alt="" className={styles.logo} />
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">
                            Nuova Password
                            {inputPasswordIsInvalid && (
                                <IonNote color="danger">
                                    {`: ${
                                        inputPasswordValue.trim() === ""
                                            ? "Obbligatoria"
                                            : "Almeno 8 caratteri"
                                    }`}
                                </IonNote>
                            )}
                        </IonLabel>
                        <IonInput
                            type="password"
                            onBlur={inputPasswordTouchedHandler}
                            onIonChange={(e) => inputPasswordChangedHandler(e)}
                            value={inputPasswordValue}
                        ></IonInput>
                    </IonItem>
                    <IonItem className={styles.inputWrapper}>
                        <IonLabel position="floating">
                            Conferma Password
                            {inputConfirmPasswordIsInvalid && (
                                <IonNote color="danger">
                                    {`: ${
                                        inputConfirmPasswordValue.trim() === ""
                                            ? "Obbligatoria"
                                            : "Almeno 8 caratteri"
                                    }`}
                                </IonNote>
                            )}
                        </IonLabel>
                        <IonInput
                            type="password"
                            onBlur={inputConfirmPasswordTouchedHandler}
                            onIonChange={(e) =>
                                inputConfirmPasswordChangedHandler(e)
                            }
                            value={inputConfirmPasswordValue}
                        ></IonInput>
                    </IonItem>
                    <IonButton
                        disabled={formIsInvalid}
                        className={`${styles.button} ${styles.mainButton}`}
                        mode="ios"
                        color="primary"
                        type="submit"
                    >
                        {capitalize(mode)}
                    </IonButton>
                </form>
            </div>
        </>
    );
};

export default PasswordPage;
