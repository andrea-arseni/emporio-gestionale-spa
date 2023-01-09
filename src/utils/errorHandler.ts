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
    const originalErrorMessage =
        e && e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : e &&
              e.response &&
              e.response.data &&
              typeof e.response.data === "string"
            ? e.response.data
            : null;

    const subHeader = originalErrorMessage ? message : "";

    let text = originalErrorMessage ? originalErrorMessage : message;

    const getButtons = () => {
        let buttons = [
            {
                text: "Chiudi",
                handler: handler,
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
};

export default errorHandler;
