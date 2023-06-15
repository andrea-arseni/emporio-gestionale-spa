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
import { isNativeApp } from "../../utils/contactUtils";
import Resizer from "react-image-file-resizer";
import localForage from "localforage";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

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
                try {
                    const readFileResult = await Filesystem.readFile({
                        path: `/immobile/${props.immobile.id}/avatar.jpg`,
                        directory: Directory.Cache,
                        encoding: Encoding.UTF8,
                    });
                    return readFileResult.data;
                } catch (e) {
                    return null;
                }
            } else {
                const base64String: string | null = await localForage.getItem(
                    `/immobile/${props.immobile.id}/avatar.jpg`
                );
                return base64String;
            }
        };

        const resizeImage = (file: File) =>
            new Promise((resolve) =>
                Resizer.imageFileResizer(
                    file,
                    300,
                    300,
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

                let base64String = getBase64StringFromByteArray(
                    res.data.byteArray,
                    primaFoto!.codiceBucket!
                );

                updatePrimaFoto(base64String);
                setShowLoading(false);

                const blob = await getBlobFromBase64String(base64String);

                const file: File | string = getFileFromBlob(
                    blob!,
                    "what",
                    "jpg"
                );

                if (!isNativeApp)
                    base64String = (await resizeImage(file!)) as string;

                //save to Storage
                if (isNativeApp) {
                    await Filesystem.writeFile({
                        path: `/immobile/${props.immobile.id}/avatar.jpg`,
                        data: base64String!,
                        directory: Directory.Cache,
                        encoding: Encoding.UTF8,
                        recursive: true,
                    });
                } else {
                    await localForage.setItem(
                        `/immobile/${props.immobile.id}/avatar.jpg`,
                        base64String
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
                    alt=""
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
