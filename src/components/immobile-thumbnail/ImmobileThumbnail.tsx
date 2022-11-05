import { IonSpinner, IonThumbnail } from "@ionic/react";
import { useEffect, useState } from "react";
import { Immobile } from "../../entities/immobile.model";
import notAvailable from "../../assets/notAvailable.png";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./ImmobileThumbnail.module.css";
import { getBase64StringFromByteArray } from "../../utils/fileUtils";

const ImmobileThumbnail: React.FC<{
    immobile: Immobile;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    const primaFoto =
        props.immobile.files!.length === 0
            ? null
            : props.immobile.files!.filter((el) => el.tipologia === "FOTO")[0];

    useEffect(() => {
        const primaFoto =
            props.immobile.files!.length === 0
                ? null
                : props.immobile.files!.filter(
                      (el) => el.tipologia === "FOTO"
                  )[0];

        const fetchImmobileAvatar = async () => {
            try {
                const url = `/immobili/${props.immobile.id}/files/${
                    primaFoto!.id
                }`;
                const res = await axiosInstance.get(url);
                primaFoto!.base64String = getBase64StringFromByteArray(
                    res.data.byteArray,
                    primaFoto!.nome!
                );
                setShowLoading(false);
            } catch (e) {
                setShowLoading(false);
            }
        };

        if (primaFoto) {
            fetchImmobileAvatar();
        } else {
            setShowLoading(false);
        }
        return () => {};
    }, [props.immobile]);

    return (
        <IonThumbnail>
            {!showLoading && (
                <img
                    className={`${styles.immagine} ${
                        props.immobile.status?.toLowerCase() === "attivo"
                            ? styles.active
                            : styles.inactive
                    }`}
                    alt="Silhouette of mountains"
                    src={primaFoto ? primaFoto.base64String : notAvailable}
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
