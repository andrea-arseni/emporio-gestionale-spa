import { AlertButton, AlertOptions } from "@ionic/react";
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions";

const errorHandler = (
    e: any,
    handler: () => void,
    message: string,
    presentAlert: {
        (message: string, buttons?: AlertButton[] | undefined): Promise<void>;
        (options: AlertOptions & HookOverlayOptions): Promise<any>;
    },
    secondHandler?: (id: number) => void
) => {
    const originalErrorMessage =
        e && e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : e && e.response && e.response.data
            ? e.response.data
            : null;

    const subHeader = originalErrorMessage ? message : "";

    let id: string | null = null;

    let text = originalErrorMessage ? originalErrorMessage : message;

    if (text.includes("E' già presente a sistema una persona")) {
        id = text.split(" id ")[1];
        text = text.split("E' la persona")[0];
    }

    const getButtons = () => {
        let buttons = [
            {
                text: "Chiudi",
                handler: handler,
            },
        ];
        if (id)
            buttons.push({
                text: "Vai alla persona in questione",
                handler: () => (secondHandler ? secondHandler(+id!) : null),
            });
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
