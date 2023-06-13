import { IonSpinner, IonThumbnail } from "@ionic/react";
import { useEffect, useState } from "react";
import { Immobile } from "../../entities/immobile.model";
import notAvailable from "../../assets/notAvailable.png";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./ImmobileThumbnail.module.css";
import {
    getBase64StringFromByteArray,
    getBlobFromBase64String,
    getFileFromBlob,
} from "../../utils/fileUtils";
import { Documento } from "../../entities/documento.model";
import { NativeStorage } from "@awesome-cordova-plugins/native-storage";
import { isNativeApp } from "../../utils/contactUtils";
import Resizer from "react-image-file-resizer";

const ImmobileThumbnail: React.FC<{
    immobile: Immobile;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const getPrimaFoto = () => {
        if (!props.immobile.files || props.immobile.files.length === 0)
            return null;
        const foto = props.immobile.files.filter(
            (el) => el.tipologia === "FOTO"
        );
        if (!foto || foto.length === 0) return null;
        return foto[0];
    };

    const [primaFoto, setPrimaFoto] = useState<Documento | null>(
        getPrimaFoto()
    );

    const [fotoFetched, setFotoFetched] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;

        const updatePrimaFoto = (base64String: string) => {
            setPrimaFoto((primaFoto) => {
                const newPrimaFoto = new Documento(
                    primaFoto!.id,
                    primaFoto!.nome,
                    primaFoto!.tipologia,
                    primaFoto!.codiceBucket,
                    props.immobile,
                    undefined,
                    base64String
                );
                return newPrimaFoto;
            });
        };

        const retrieveImageFromStorage = async () => {
            if (isNativeApp) {
                return await NativeStorage.getItem(
                    `immobile/${props.immobile.id}/avatar`
                );
            } else {
                return localStorage.getItem(
                    `immobile/${props.immobile.id}/avatar`
                );
            }
        };

        const resizeImage = (file: File) =>
            new Promise((resolve) =>
                Resizer.imageFileResizer(
                    file,
                    100,
                    100,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        resolve(uri);
                    }
                )
            );

        const fetchImmobileAvatar = async () => {
            const localImage = await retrieveImageFromStorage();

            if (localImage) {
                updatePrimaFoto(localImage);
                setFotoFetched(true);
                return;
            }

            try {
                setShowLoading(true);
                const url = `/immobili/${props.immobile.id}/files/${
                    primaFoto!.id
                }`;
                const res = await axiosInstance.get(url);
                if (!mounted) return;
                setFotoFetched(true);

                const base64String = getBase64StringFromByteArray(
                    res.data.byteArray,
                    primaFoto!.codiceBucket!
                );

                updatePrimaFoto(base64String);
                setShowLoading(false);

                const blob = await getBlobFromBase64String(base64String);

                const file = getFileFromBlob(blob, "what", "jpg");

                const resizedFileBase64String = (await resizeImage(
                    file
                )) as string;

                //save to Storage
                if (isNativeApp) {
                    await NativeStorage.setItem(
                        `immobile/${props.immobile.id}/avatar`,
                        resizedFileBase64String
                    );
                } else {
                    localStorage.setItem(
                        `immobile/${props.immobile.id}/avatar`,
                        resizedFileBase64String
                    );
                }
            } catch (e) {
                if (!mounted) return;
                setShowLoading(false);
            }
        };

        if (primaFoto && !fotoFetched) {
            fetchImmobileAvatar();
        }
        return () => {
            mounted = false;
        };
    }, [props.immobile, primaFoto, fotoFetched]);

    return (
        <IonThumbnail>
            {!showLoading && (
                <img
                    className={`${styles.immagine} ${
                        props.immobile.status?.toLowerCase() === "attivo"
                            ? styles.active
                            : styles.inactive
                    }`}
                    alt="Foto non disponibile"
                    src={primaFoto ? primaFoto!.base64String : notAvailable}
                />
            )}
            {showLoading && (
                <div
                    className={`centered ${styles.immagine} ${
                        props.immobile.status?.toLowerCase() === "attivo"
                            ? styles.active
                            : styles.inactive
                    }`}
                >
                    <IonSpinner color="primary"></IonSpinner>
                </div>
            )}
        </IonThumbnail>
    );
};

export default ImmobileThumbnail;
