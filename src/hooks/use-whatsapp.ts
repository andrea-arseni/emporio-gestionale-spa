import { useCallback, useEffect, useState } from "react";
import { isNativeApp } from "../utils/contactUtils";
import { isPlatform } from "@ionic/react";
import { AppAvailability } from "@awesome-cordova-plugins/app-availability";
import { AppLauncher } from "@capacitor/app-launcher";

const useWhatsApp = (telefono: string, inputValue: string) => {
    const sendWhatsapp = async () => {
        const formattedPhoneNumber = telefono.replace(/[^+\d]/g, "");
        const encodedMessage = encodeURIComponent(inputValue);
        try {
            await new Promise((r) => setTimeout(r, 400));
            await AppLauncher.openUrl({
                url: `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}&text=${encodedMessage}`,
            });
        } catch (e) {
            alert("WhatsApp non disponibile");
        }
    };

    const isWhatsAppAvailable = useCallback(async () => {
        let scheme = null;

        if (isNativeApp && isPlatform("ios")) {
            scheme = "whatsapp://";
        } else if (isNativeApp && isPlatform("android")) {
            scheme = "com.whatsapp";
        } else return false;

        try {
            return await AppAvailability.check(scheme);
        } catch (e) {
            return false;
        }
    }, []);

    const [whatsAppAvailable, setWhatsAppAvailable] = useState<boolean>(false);

    useEffect(() => {
        const checkWhatsAppAvailability = async () => {
            const isAvailable = await isWhatsAppAvailable();
            setWhatsAppAvailable(isAvailable);
        };

        checkWhatsAppAvailability();
    }, [isWhatsAppAvailable]);

    return { whatsAppAvailable, sendWhatsapp };
};

export default useWhatsApp;
