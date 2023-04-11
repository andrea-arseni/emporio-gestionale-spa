import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";
import { isNativeApp } from "./contactUtils";
import errorHandler from "./errorHandler";

export const shareObject = async (
    message: string,
    url: string | undefined,
    subject: string
) => {
    if (isNativeApp) {
        await SocialSharing.shareWithOptions({
            message,
            url,
            subject,
        });
    } else {
        await navigator.share({
            title: subject,
            text: message,
            url,
        });
    }
};

export const checkShareability = (presentAlert: any) => {
    if (!isNativeApp && !navigator.canShare) {
        errorHandler(
            null,
            () => {},
            "Questo Browser non permette la condivisione di file.",
            presentAlert
        );
        return false;
    }
    return true;
};

export const checkSpecificFileShareability = (
    presentAlert: any,
    file: File
) => {
    if (!isNativeApp && !navigator.canShare({ files: [file] })) {
        errorHandler(
            null,
            () => {},
            `${file.name} non può essere condiviso.`,
            presentAlert
        );
        return false;
    }
    return true;
};
