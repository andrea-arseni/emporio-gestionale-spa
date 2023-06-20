import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";
import { isNativeApp } from "./contactUtils";

export const shareObject = async (
    message: string,
    url: string | undefined,
    subject: string
) => {
    const words: string[] = message.split(" ");

    if (words[words.length - 1].startsWith("https://www.emporio-case.com")) {
        url = words.pop();
        message = words.join(" ");
    }

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

export const isSharingAvailable = () => isNativeApp || navigator.canShare;

export const NOT_SHAREABLE_MSG =
    "Questo Browser non permette la condivisione di file.";

export const checkSpecificFileShareability = (
    errorHandler: any,
    file: File
) => {
    if (!isNativeApp && !navigator.canShare({ files: [file] })) {
        errorHandler(null, `${file.name} non può essere condiviso.`);
        return false;
    }
    return true;
};
