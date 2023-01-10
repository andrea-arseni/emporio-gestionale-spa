import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
    IonProgressBar,
    useIonAlert,
} from "@ionic/react";
import React, { FormEvent, Fragment, useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import logo from "../../../assets/logo.png";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import { performLogin } from "../../../store/auth-thunk";
import { useAppDispatch } from "../../../hooks";
import { loginData } from "../../../store/auth-slice";

const AuthPage: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const [mode, setMode] = useState<"login" | "forgot-password">("login");

    const [progress, setProgress] = useState<number>(1);

    const [timeRemaining, setTimeRemaining] = useState<number>(120);

    const [firstStepAccomplished, setFirstStepAccomplished] =
        useState<boolean>(false);

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

    const {
        inputValue: inputCodeValue,
        inputIsInvalid: inputCodeIsInvalid,
        inputTouchedHandler: inputCodeTouchedHandler,
        inputChangedHandler: inputCodeChangedHandler,
        inputIsTouched: inputCodeIsTouched,
    } = useInput((el) => el.toString().trim().length === 6, "");

    useEffect(() => {
        let timeOut: NodeJS.Timeout | null = null;
        let intervalTimeout: null | NodeJS.Timeout = null;
        if (firstStepAccomplished) {
            timeOut = setTimeout(() => {
                window.location.reload();
            }, 120000);

            intervalTimeout = setInterval(() => {
                setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
                setProgress((prevProgress) => prevProgress - 0.0084);
            }, 1000);
        }
        return () => {
            if (timeOut) clearTimeout(timeOut);
            if (intervalTimeout) clearInterval(intervalTimeout);
        };
    }, [firstStepAccomplished]);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const getTiming = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = Math.floor(timeRemaining % 60);
        const minutesText = `${minutes} minut${minutes === 1 ? "o" : "i"}`;
        const secondsText = `${seconds} second${seconds === 1 ? "o" : "i"}`;
        if (minutes === 0 || (minutes === 0 && seconds === 0))
            return secondsText;
        if (seconds === 0) return minutesText;
        return `${minutesText} e ${secondsText}`;
    };

    const formIsInvalid = () => {
        if (mode === "login") {
            return (
                inputNameIsInvalid ||
                inputPasswordIsInvalid ||
                inputNameValue.trim() === "" ||
                inputPasswordValue.trim() === "" ||
                (firstStepAccomplished && inputCodeIsInvalid) ||
                (firstStepAccomplished && !inputCodeIsTouched)
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
                () => {
                    if (firstStepAccomplished) window.location.reload();
                },
                `${
                    mode === "login" ? "Login" : "Richiesta recupero password"
                } non riuscita`,
                presentAlert
            );
        }
    };

    const submitLoginCall = async () => {
        const reqBody = {
            nameOrEmail: inputNameValue.trim(),
            password: inputPasswordValue,
            code: inputCodeValue.trim().length > 0 ? +inputCodeValue : null,
        };
        console.log(reqBody);
        const res = await axiosInstance.post(`users/login`, reqBody);
        console.log(res);
        setShowLoading(false);
        const loginData: loginData = res.data;
        if (loginData.token) {
            // salva il token in global state
            // salva il token in localstorage
            // dichiara che sei entrato
            dispatch(performLogin(loginData));
        } else {
            setFirstStepAccomplished(true);
        }
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
            {!firstStepAccomplished && (
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
            )}
            {!firstStepAccomplished && (
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
            )}
            {firstStepAccomplished && (
                <IonItem className={styles.inputWrapper}>
                    <IonLabel position="floating">Inserisci il Codice</IonLabel>
                    <IonInput
                        type="text"
                        onBlur={inputCodeTouchedHandler}
                        onIonChange={(e) => inputCodeChangedHandler(e)}
                        value={inputCodeValue}
                    ></IonInput>
                    {inputCodeIsInvalid && (
                        <IonNote color="danger">
                            {`Lunghezza non valida`}
                        </IonNote>
                    )}
                </IonItem>
            )}
            {firstStepAccomplished && (
                <div className={`centered vertical ${styles.progressDiv}`}>
                    <p className={`alignedCenter ${styles.timeSentence}`}>
                        {`Tempo Rimanente:`}
                        <br />
                        {getTiming()}
                    </p>
                    <IonProgressBar value={progress}></IonProgressBar>
                </div>
            )}
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
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="wrapper centered gray">
                <form className={`${styles.form} centered`}>
                    <img src={logo} alt="" className={styles.logo} />
                    {mode === "login" && loginInputs}
                    {mode === "forgot-password" && forgotPasswordInput}
                    {!firstStepAccomplished && (
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
                    )}
                    <IonButton
                        disabled={formIsInvalid()}
                        className={`${styles.button} ${styles.mainButton}`}
                        mode="ios"
                        color="primary"
                        type="button"
                        onClick={(e) => onSubmitHandler(e)}
                    >
                        {mode === "login"
                            ? "Login"
                            : "Ho dimenticato la password"}
                    </IonButton>
                </form>
            </div>
        </>
    );
};

export default AuthPage;
