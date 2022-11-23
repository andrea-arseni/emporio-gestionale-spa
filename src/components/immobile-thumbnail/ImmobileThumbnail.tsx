import { IonSpinner, IonThumbnail } from "@ionic/react";
import { useEffect, useState } from "react";
import { Immobile } from "../../entities/immobile.model";
import notAvailable from "../../assets/notAvailable.png";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./ImmobileThumbnail.module.css";
import { getBase64StringFromByteArray } from "../../utils/fileUtils";
import { Documento } from "../../entities/documento.model";

const ImmobileThumbnail: React.FC<{
    immobile: Immobile;
}> = (props) => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

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

    useEffect(() => {
        let mounted = true;

        const fetchImmobileAvatar = async () => {
            try {
                const url = `/immobili/${props.immobile.id}/files/${
                    primaFoto!.id
                }`;
                const res = await axiosInstance.get(url);
                if (!mounted) return;
                setPrimaFoto((primaFoto) => {
                    const newPrimaFoto = new Documento(
                        primaFoto!.id,
                        primaFoto!.nome,
                        primaFoto!.tipologia,
                        primaFoto!.codiceBucket,
                        props.immobile,
                        undefined,
                        getBase64StringFromByteArray(
                            res.data.byteArray,
                            primaFoto!.nome!
                        )
                    );
                    return newPrimaFoto;
                });
                setShowLoading(false);
            } catch (e) {
                if (!mounted) return;
                setShowLoading(false);
            }
        };

        if (primaFoto) {
            fetchImmobileAvatar();
        } else {
            setShowLoading(false);
        }
        return () => {
            mounted = false;
        };
    }, [props.immobile, primaFoto]);

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
