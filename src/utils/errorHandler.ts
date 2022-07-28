import { AlertButton, AlertOptions } from "@ionic/react";
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions";

const errorHandler = (
    e: any,
    handler: () => void,
    message: string,
    presentAlert: {
        (message: string, buttons?: AlertButton[] | undefined): Promise<void>;
        (options: AlertOptions & HookOverlayOptions): Promise<any>;
    }
) => {
    presentAlert({
        header: "Errore",
        subHeader: `${e.response.data.message ? `${message}` : ""}`,
        message: `${
            e.response.data.message ? e.response.data.message : `${message}`
        }`,
        buttons: [
            {
                text: "OK",
                handler: handler,
            },
        ],
        backdropDismiss: true,
    });
};

export default errorHandler;
