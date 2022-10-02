import {
    IonItem,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonText,
    IonThumbnail,
    useIonAlert,
} from "@ionic/react";
import {
    downloadOutline,
    createOutline,
    trashOutline,
    shareOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Documento } from "../../entities/documento.model";
import { Entity } from "../../entities/entity";
import useWindowSize from "../../hooks/use-size";
import { downloadFile, getFileType } from "../../utils/fileUtils";
import styles from "./Lists.module.css";
import word from "../../assets/word.png";
import excel from "../../assets/excel.png";
import text from "../../assets/txt.png";
import image from "../../assets/image.png";
import pdf from "../../assets/pdf.png";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";

const ListDocumenti: React.FC<{
    documenti: Documento[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
}> = (props) => {
    const [width] = useWindowSize();
    const [presentAlert] = useIonAlert();

    const [currentFile, setCurrentFile] = useState<{
        documento: Documento;
        byteArray: string;
    } | null>(null);

    const getThumbnail = (
        type: "image" | "word" | "excel" | "pdf" | "text" | "error"
    ) => {
        if (type === "image") return image;
        if (type === "excel") return excel;
        if (type === "pdf") return pdf;
        if (type === "text") return text;
        if (type === "word") return word;
        console.log("Errore");
    };

    const getFileAndDownload = async (documento: Documento) => {
        if (
            currentFile &&
            currentFile.documento &&
            currentFile.documento.id &&
            currentFile.documento.id === documento.id
        ) {
            downloadFile(currentFile.byteArray, currentFile.documento);
        }
        props.setShowLoading(true);
        try {
            const res = await axiosInstance.get(`/documenti/${documento.id!}`);
            props.setShowLoading(false);
            setCurrentFile({
                documento: res.data.file,
                byteArray: res.data.byteArray,
            });
            downloadFile(res.data.byteArray, res.data.file);
            // catch error
        } catch (e) {
            props.setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Download del file non riuscito",
                presentAlert
            );
        }
    };

    const getDocumento = (documento: Documento) => {
        const type = getFileType(documento.nome!);
        return (
            <IonItem key={documento.id} detail>
                <IonThumbnail slot="start" className={styles.border}>
                    <img alt={type} src={getThumbnail(type)} />
                </IonThumbnail>
                <IonLabel text-wrap>
                    <h2>{documento.nome} </h2>
                </IonLabel>
            </IonItem>
        );
    };

    return (
        <>
            {props.documenti.map((documento: Documento) => (
                <IonItemSliding
                    key={documento.id!}
                    id={documento.id?.toString()}
                >
                    {getDocumento(documento)}
                    <IonItemOptions side="end">
                        <IonItemOption color="primary">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => getFileAndDownload(documento)}
                            >
                                <IonIcon
                                    icon={downloadOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Scarica</IonText>
                                ) : (
                                    <p className={styles.little}>Scarica</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="success">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => {
                                    console.log("Condividi");
                                }}
                            >
                                <IonIcon
                                    icon={shareOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Condividi</IonText>
                                ) : (
                                    <p className={styles.little}>Condividi</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="link">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => {
                                    props.setCurrentEntity(documento);
                                    props.setMode("form");
                                }}
                            >
                                <IonIcon
                                    icon={createOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Rinomina</IonText>
                                ) : (
                                    <p className={styles.little}>Rinomina</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="danger">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() =>
                                    props.deleteEntity(
                                        "persone",
                                        documento.id!.toString(),
                                        `Hai selezionato la cancellazione del documento selezionato. Si tratta di un processo irreversibile.`
                                    )
                                }
                            >
                                <IonIcon
                                    icon={trashOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Elimina</IonText>
                                ) : (
                                    <p className={styles.little}>Elimina</p>
                                )}
                            </div>
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListDocumenti;
