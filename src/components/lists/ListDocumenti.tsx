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
    checkmarkCircleOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Documento } from "../../entities/documento.model";
import { Entity } from "../../entities/entity";
import useWindowSize from "../../hooks/use-size";
import {
    downloadFile,
    getFileNameWithoutExtension,
    getFileType,
    shareFile,
} from "../../utils/fileUtils";
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

    const selectFile = async (documento: Documento) => {
        props.setShowLoading(true);
        try {
            const res = await axiosInstance.get(`/documenti/${documento.id!}`);
            props.setShowLoading(false);
            setCurrentFile({
                documento: res.data.file,
                byteArray: res.data.byteArray,
            });
            return res.data;
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

    const getFileAndDownload = async (documento: Documento) => {
        if (
            currentFile &&
            currentFile.documento &&
            currentFile.documento.id &&
            currentFile.documento.id === documento.id
        ) {
            downloadFile(currentFile.byteArray, currentFile.documento);
        } else {
            const res = await selectFile(documento);
            downloadFile(res.byteArray, res.file);
        }
    };

    const isFileSelected = (id: number) =>
        currentFile &&
        currentFile.documento &&
        currentFile.documento.id &&
        currentFile.documento.id === id;

    const getDocumento = (documento: Documento) => {
        const type = getFileType(documento.nome!);
        return (
            <IonItem key={documento.id} detail>
                <IonThumbnail slot="start" className={styles.border}>
                    <img alt={type} src={getThumbnail(type)} />
                </IonThumbnail>
                <IonLabel text-wrap>
                    <h2>{getFileNameWithoutExtension(documento.nome!)} </h2>
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
                        <IonItemOption
                            color={
                                isFileSelected(documento.id!)
                                    ? "success"
                                    : "tertiary"
                            }
                        >
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() =>
                                    isFileSelected(documento.id!)
                                        ? shareFile(
                                              currentFile!.byteArray,
                                              currentFile!.documento,
                                              presentAlert
                                          )
                                        : selectFile(documento)
                                }
                            >
                                <IonIcon
                                    icon={
                                        isFileSelected(documento.id!)
                                            ? shareOutline
                                            : checkmarkCircleOutline
                                    }
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>
                                        {isFileSelected(documento.id!)
                                            ? "Condividi"
                                            : "Seleziona"}
                                    </IonText>
                                ) : (
                                    <p className={styles.little}>
                                        {isFileSelected(documento.id!)
                                            ? "Condividi"
                                            : "Seleziona"}
                                    </p>
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
                                        "documenti",
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
