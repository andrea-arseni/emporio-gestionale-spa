import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
    useIonAlert,
} from "@ionic/react";
import React, { FormEvent, Fragment, useState } from "react";
import styles from "./AuthPage.module.css";
import logo from "../../../assets/logo.png";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import { performLogin } from "../../../store/auth-thunk";
import { useAppDispatch } from "../../../hooks";

const AuthPage: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const [mode, setMode] = useState<"login" | "forgot-password">("login");

    const revertMode = () =>
        setMode((prevState) =>
            prevState === "login" ? "forgot-password" : "login"
        );

    const {
        inputValue: inputNameValue,
        inputIsInvalid: inputNameIsInvalid,
        inputTouchedHandler: inputNameTouchedHandler,
        inputChangedHandler: inputNameChangedHandler,
        reset: inputNameReset,
    } = useInput((el) => el.toString().trim().length > 0);

    const {
        inputValue: inputPasswordValue,
        inputIsInvalid: inputPasswordIsInvalid,
        inputTouchedHandler: inputPasswordTouchedHandler,
        inputChangedHandler: inputPasswordChangedHandler,
        reset: inputPasswordReset,
    } = useInput((el) => el.toString().trim().length > 7);

    const {
        inputValue: inputEmailValue,
        inputIsInvalid: inputEmailIsInvalid,
        inputTouchedHandler: inputEmailTouchedHandler,
        inputChangedHandler: inputEmailChangedHandler,
        reset: inputEmailReset,
    } = useInput((el) => /\S+@\S+\.\S+/.test(el.toString()));

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const formIsInvalid = () => {
        if (mode === "login") {
            return (
                inputNameIsInvalid ||
                inputPasswordIsInvalid ||
                inputNameValue.trim() === "" ||
                inputPasswordValue.trim() === ""
            );
        } else {
            return inputEmailIsInvalid || inputEmailValue.trim() === "";
        }
    };

    const resetForm = () => {
        if (mode === "login") {
            inputNameReset();
            inputPasswordReset();
        } else {
            inputEmailReset();
        }
    };

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        try {
            await (mode === "login"
                ? submitLoginCall()
                : submitForgotPasswordCall());
        } catch (e: any) {
            setShowLoading(false);
            errorHandler(
                e,
                () => resetForm(),
                `${
                    mode === "login" ? "Login" : "Richiesta recupero password"
                } non riuscita`,
                presentAlert
            );
        }
    };

    const submitLoginCall = async () => {
        const res = await axiosInstance.post(`users/login`, {
            nameOrEmail: inputNameValue.trim(),
            password: inputPasswordValue,
        });
        setShowLoading(false);
        const userData = res.data;
        // salva il token in global state
        // salva il token in localstorage
        // dichiara che sei entrato
        dispatch(performLogin(userData));
    };

    const submitForgotPasswordCall = async () => {
        await axiosInstance.post(`users/forgot-password`, {
            name: "",
            email: inputEmailValue,
        });
        setShowLoading(false);
        // call successfull, check email
        presentAlert({
            header: "Ottimo",
            subHeader: `Richiesta inviata`,
            message: `Dovresti ricevere una mail all'indirizzo ${inputEmailValue} con il link per il recupero della password`,
            buttons: [
                {
                    text: "OK",
                    handler: () => {
                        resetForm();
                        setMode("login");
                    },
                },
            ],
        });
    };

    const loginInputs = (
        <Fragment>
            <IonItem className={styles.inputWrapper}>
                <IonLabel position="floating">
                    Username o Email
                    {inputNameIsInvalid && (
                        <IonNote color="danger">{`: Obbligatorio`}</IonNote>
                    )}
                </IonLabel>
                <IonInput
                    type="text"
                    onBlur={inputNameTouchedHandler}
                    onIonChange={(e) => inputNameChangedHandler(e)}
                    value={inputNameValue}
                ></IonInput>
            </IonItem>
            <IonItem className={styles.inputWrapper}>
                <IonLabel position="floating">
                    Password
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
        </Fragment>
    );

    const forgotPasswordInput = (
        <IonItem className={styles.inputWrapper}>
            <IonLabel position="floating">
                Email
                {inputEmailIsInvalid && (
                    <IonNote color="danger">{`: Email non valida`}</IonNote>
                )}
            </IonLabel>
            <IonInput
                type="text"
                onBlur={inputEmailTouchedHandler}
                onIonChange={(e) => inputEmailChangedHandler(e)}
                value={inputEmailValue}
            ></IonInput>
        </IonItem>
    );

    return (
        <IonContent>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="wrapper centered gray">
                <form
                    className={`${styles.form} centered`}
                    onSubmit={(e) => onSubmitHandler(e)}
                >
                    <img src={logo} alt="" className={styles.logo} />
                    {mode === "login" && loginInputs}
                    {mode === "forgot-password" && forgotPasswordInput}
                    <IonButton
                        className={`${styles.button} ${styles.link}`}
                        mode="ios"
                        color="primary"
                        fill="clear"
                        type="button"
                        onClick={revertMode}
                    >
                        {mode === "login"
                            ? "Ho dimenticato la password"
                            : "Login"}
                    </IonButton>
                    <IonButton
                        disabled={formIsInvalid()}
                        className={`${styles.button} ${styles.mainButton}`}
                        mode="ios"
                        color="primary"
                        type="submit"
                    >
                        {mode === "login"
                            ? "Login"
                            : "Ho dimenticato la password"}
                    </IonButton>
                </form>
            </div>
        </IonContent>
    );
};

export default AuthPage;
