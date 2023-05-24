import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonNote,
} from "@ionic/react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAppDispatch } from "../../../hooks";
import useInput from "../../../hooks/use-input";
import { performLogin } from "../../../store/auth-thunk";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
import styles from "./PasswordPage.module.css";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import useErrorHandler from "../../../hooks/use-error-handler";
import useSingleClick from "../../../hooks/use-single-click";

const PasswordPage: React.FC<{}> = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const mode = location.pathname.substring(1).replace("-", " ");

    const [showOriginalPassword, setShowOriginalPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { hasBeenClicked, setHasBeenClicked } = useSingleClick();

    const { errorHandler, isError } = useErrorHandler();

    const togglePasswordVisibility = (type: "original" | "confirm") => {
        type === "original"
            ? setShowOriginalPassword(!showOriginalPassword)
            : setShowConfirmPassword(!showConfirmPassword);
    };

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

    const formIsInvalid = useMemo(
        () =>
            inputPasswordIsInvalid ||
            inputConfirmPasswordIsInvalid ||
            inputPasswordValue.trim() === "" ||
            inputConfirmPasswordValue.trim() === "",
        [
            inputPasswordIsInvalid,
            inputConfirmPasswordIsInvalid,
            inputPasswordValue,
            inputConfirmPasswordValue,
        ]
    );

    const resetForm = useCallback(() => {
        inputPasswordReset();
        inputConfirmPasswordReset();
    }, [inputPasswordReset, inputConfirmPasswordReset]);

    const eseguiForm = useCallback(async () => {
        const queryStrings: string[] = location.search.substring(1).split("&");
        let token = queryStrings.find((el) => el.startsWith("token="));
        if (token) token = token.substring(6);
        let id = queryStrings.find((el) => el.startsWith("id="));
        if (id) id = id.substring(3);
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
            resetForm();
            errorHandler(
                e,
                `${
                    mode === "rinnova password"
                        ? "Richiesta rinnovo password"
                        : "Richiesta primo accesso"
                } non riuscita`
            );
        }
    }, [
        dispatch,
        errorHandler,
        inputConfirmPasswordValue,
        inputPasswordValue,
        location.search,
        mode,
        resetForm,
    ]);

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        await eseguiForm();
    };

    useEffect(() => {
        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (e.key === "Enter" && !isError && !formIsInvalid) {
                setHasBeenClicked(true);
                if (hasBeenClicked) {
                    await eseguiForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [eseguiForm, formIsInvalid, hasBeenClicked, isError, setHasBeenClicked]);

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
                            autofocus
                            type={showOriginalPassword ? "text" : "password"}
                            onBlur={inputPasswordTouchedHandler}
                            onIonChange={(e) => inputPasswordChangedHandler(e)}
                            value={inputPasswordValue}
                        ></IonInput>
                        <IonIcon
                            className={styles.eyeIcon}
                            icon={
                                showOriginalPassword
                                    ? eyeOffOutline
                                    : eyeOutline
                            }
                            onClick={() => togglePasswordVisibility("original")}
                        />
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
                            type={showConfirmPassword ? "text" : "password"}
                            onBlur={inputConfirmPasswordTouchedHandler}
                            onIonChange={(e) =>
                                inputConfirmPasswordChangedHandler(e)
                            }
                            value={inputConfirmPasswordValue}
                        ></IonInput>
                        <IonIcon
                            className={styles.eyeIcon}
                            icon={
                                showConfirmPassword ? eyeOffOutline : eyeOutline
                            }
                            onClick={() => togglePasswordVisibility("confirm")}
                        />
                    </IonItem>
                    <IonButton
                        disabled={
                            formIsInvalid ||
                            inputConfirmPasswordValue !== inputPasswordValue
                        }
                        className={`${styles.button} ${styles.mainButton}`}
                        mode="ios"
                        color="primary"
                        type="submit"
                    >
                        {!formIsInvalid &&
                        inputConfirmPasswordValue !== inputPasswordValue
                            ? "Password non corrispondenti"
                            : capitalize(mode)}
                    </IonButton>
                </form>
            </div>
        </>
    );
};

export default PasswordPage;
