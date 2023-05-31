import { useIonAlert } from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import { setError } from "../store/ui-slice";
import { performLogout } from "../store/auth-thunk";

const useErrorHandler = () => {
    const [isError, setIsError] = useState<boolean>(false);

    const [isReload, setIsReload] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [presentAlert, hideAlert] = useIonAlert();

    const resetError = useCallback(() => {
        dispatch(setError(null));
        setIsError(false);
        hideAlert();
    }, [hideAlert, dispatch]);

    const errorHandler = useCallback(
        (e: any, message: string, reload = false) => {
            setIsError(true);
            setIsReload(reload);

            const originalErrorMessage =
                e && e.response && e.response.data && e.response.data.message
                    ? e.response.data.message
                    : e &&
                      e.response &&
                      e.response.data &&
                      typeof e.response.data === "string"
                    ? e.response.data
                    : null;

            if (
                originalErrorMessage ===
                "Errore nella lettura del token, procedura annullata."
            ) {
                reload = true;
                dispatch(performLogout());
            }

            const subHeader =
                originalErrorMessage &&
                originalErrorMessage ===
                    "Errore nella lettura del token, procedura annullata."
                    ? "Sessione di 90 giorni scaduta."
                    : originalErrorMessage
                    ? message
                    : "";

            let text =
                originalErrorMessage ===
                "Errore nella lettura del token, procedura annullata."
                    ? "Rifare la login."
                    : originalErrorMessage
                    ? originalErrorMessage
                    : message;

            const getButtons = () => {
                let buttons = [
                    {
                        text: "Chiudi",
                        handler: () => {
                            reload ? window.location.reload() : resetError();
                        },
                    },
                ];
                return buttons;
            };

            presentAlert({
                header: "Errore",
                subHeader,
                message: text,
                buttons: getButtons(),
                backdropDismiss: true,
            });
        },
        [presentAlert, resetError, dispatch]
    );

    useEffect(() => {
        const hideAlertIfError = (e: KeyboardEvent) => {
            if (isError && e.key === "Enter") {
                isReload ? window.location.reload() : resetError();
            }
        };

        window.addEventListener("keydown", hideAlertIfError);
        return () => {
            window.removeEventListener("keydown", hideAlertIfError);
        };
    }, [isError, isReload, resetError]);

    return {
        isError,
        presentAlert,
        hideAlert,
        errorHandler,
    };
};

export default useErrorHandler;
