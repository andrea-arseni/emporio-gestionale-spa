import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
    IonProgressBar,
    useIonAlert,
} from "@ionic/react";
import React, {
    FormEvent,
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import styles from "./AuthPage.module.css";
import logo from "../../../assets/logo.png";
import useInput from "../../../hooks/use-input";
import axiosInstance from "../../../utils/axiosInstance";
import { performLogin } from "../../../store/auth-thunk";
import { useAppDispatch } from "../../../hooks";
import { loginData } from "../../../store/auth-slice";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";

const AuthPage: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const [mode, setMode] = useState<"login" | "forgot-password">("login");

    const [progress, setProgress] = useState<number>(1);

    const [attempt, setAttempt] = useState<number>(1);

    const increaseAttempt = () => setAttempt((prevAttempt) => ++prevAttempt);

    const { errorHandler, isError } = useErrorHandler();

    const { hasBeenClicked, setHasBeenClicked, releaseFocus } =
        useSingleClick();

    const [timeRemaining, setTimeRemaining] = useState<number>(120);

    const inputUserRef = useRef<HTMLIonInputElement>(null);
    const inputCodeRef = useRef<HTMLIonInputElement>(null);
    const inputEmailRef = useRef<HTMLIonInputElement>(null);

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

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        const setFocusOnUser = async () => {
            timeout = await new Promise((r) => setTimeout(r, 300));
            inputUserRef.current?.setFocus();
        };

        const setFocusOnCode = async () => {
            timeout = await new Promise((r) => setTimeout(r, 300));
            inputCodeRef.current?.setFocus();
        };

        const setFocusOnEmail = async () => {
            timeout = await new Promise((r) => setTimeout(r, 300));
            inputEmailRef.current?.setFocus();
        };

        if (firstStepAccomplished) {
            setFocusOnCode();
        } else if (mode === "login") {
            setFocusOnUser();
        } else {
            setFocusOnEmail();
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [firstStepAccomplished, mode]);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    const formIsInvalid = useCallback(() => {
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
    }, [
        firstStepAccomplished,
        inputCodeIsInvalid,
        inputCodeIsTouched,
        inputEmailIsInvalid,
        inputEmailValue,
        inputNameIsInvalid,
        inputNameValue,
        inputPasswordIsInvalid,
        inputPasswordValue,
        mode,
    ]);

    const resetForm = useCallback(() => {
        if (mode === "login") {
            inputNameReset();
            inputPasswordReset();
        } else {
            inputEmailReset();
        }
    }, [inputNameReset, inputPasswordReset, inputEmailReset, mode]);

    const submitLoginCall = useCallback(async () => {
        const reqBody = {
            nameOrEmail: inputNameValue.trim(),
            password: inputPasswordValue,
            code:
                inputCodeValue.trim().length > 0 ? inputCodeValue.trim() : null,
        };
        const res = await axiosInstance.post(`users/login`, reqBody);
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
    }, [dispatch, inputCodeValue, inputNameValue, inputPasswordValue]);

    const submitForgotPasswordCall = useCallback(async () => {
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
    }, [inputEmailValue, presentAlert, resetForm]);

    const eseguiForm = useCallback(async () => {
        setShowLoading(true);
        try {
            await (mode === "login"
                ? submitLoginCall()
                : submitForgotPasswordCall());
        } catch (e: any) {
            setShowLoading(false);
            if (firstStepAccomplished) increaseAttempt();
            errorHandler(
                e,
                `${
                    mode === "login" ? "Login" : "Richiesta recupero password"
                } non riuscita`,
                attempt === 3
            );
        }
    }, [
        errorHandler,
        mode,
        submitForgotPasswordCall,
        submitLoginCall,
        firstStepAccomplished,
        attempt,
    ]);

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    useEffect(() => {
        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                releaseFocus();
                setHasBeenClicked(true);
                if (hasBeenClicked && !formIsInvalid() && !isError) {
                    await eseguiForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [
        eseguiForm,
        formIsInvalid,
        releaseFocus,
        setHasBeenClicked,
        hasBeenClicked,
        isError,
        firstStepAccomplished,
        inputCodeValue,
        mode,
    ]);

    const preventSubmit = (event: FormEvent) => {
        event.preventDefault();
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
                        ref={inputUserRef}
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
                        type={showPassword ? "text" : "password"}
                        onBlur={inputPasswordTouchedHandler}
                        onIonChange={(e) => inputPasswordChangedHandler(e)}
                        value={inputPasswordValue}
                    ></IonInput>
                    <IonIcon
                        className={styles.eyeIcon}
                        icon={showPassword ? eyeOffOutline : eyeOutline}
                        onClick={togglePasswordVisibility}
                    />
                </IonItem>
            )}
            {firstStepAccomplished && (
                <IonItem className={styles.inputWrapper}>
                    <IonLabel position="floating">Inserisci il Codice</IonLabel>
                    <IonInput
                        ref={inputCodeRef}
                        type="text"
                        onBlur={inputCodeTouchedHandler}
                        onIonChange={(e) => inputCodeChangedHandler(e)}
                        onKeyDown={(event) =>
                            event.key === "Enter" && preventSubmit(event)
                        }
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
                        <em
                            style={{
                                color:
                                    attempt === 1
                                        ? "green"
                                        : attempt === 2
                                        ? "orange"
                                        : "red",
                            }}
                        >{`Tentativo ${attempt} di 3`}</em>
                        <br />
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
                ref={inputEmailRef}
                type="text"
                onBlur={inputEmailTouchedHandler}
                onIonChange={(e) => inputEmailChangedHandler(e)}
                value={inputEmailValue}
                onKeyDown={(event) =>
                    event.key === "Enter" && preventSubmit(event)
                }
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
                        onKeyDown={(e) => e.preventDefault()}
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
