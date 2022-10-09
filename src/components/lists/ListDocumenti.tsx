import {
    IonItem,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonThumbnail,
    useIonAlert,
} from "@ionic/react";
import {
    downloadOutline,
    createOutline,
    trashOutline,
    shareOutline,
    checkmarkCircleOutline,
    openOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Documento } from "../../entities/documento.model";
import { Entity } from "../../entities/entity";
import {
    downloadFile,
    getFileNameWithoutExtension,
    getFileType,
    openFile,
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
import ItemOption from "./ItemOption";

const ListDocumenti: React.FC<{
    documenti: Documento[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
    baseUrl: string;
}> = (props) => {
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

    const selectFile = async (id: number) => {
        const url = `${props.baseUrl}/${id}`;
        props.setShowLoading(true);
        try {
            const res = await axiosInstance.get(url);
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

    const isFileSelected = (id: number) =>
        currentFile &&
        currentFile.documento &&
        currentFile.documento.id &&
        currentFile.documento.id === id;

    const getFileAndOpen = async (documento: Documento) => {
        if (isFileSelected(documento.id!)) {
            openFile(currentFile!.byteArray, currentFile!.documento);
        } else {
            const res = await selectFile(documento.id!);
            openFile(res.byteArray, res.file);
        }
    };

    const getFileAndDownload = async (documento: Documento) => {
        if (isFileSelected(documento.id!)) {
            downloadFile(currentFile!.byteArray, currentFile!.documento);
        } else {
            const res = await selectFile(documento.id!);
            downloadFile(res.byteArray, res.file);
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
                        {(getFileType(documento.nome!) === "image" ||
                            getFileType(documento.nome!) === "pdf") && (
                            <ItemOption
                                handler={(documento) =>
                                    getFileAndOpen(documento)
                                }
                                entity={documento}
                                colorType={"dark"}
                                icon={openOutline}
                                title={"Leggi"}
                            />
                        )}
                        <ItemOption
                            handler={(documento) =>
                                getFileAndDownload(documento)
                            }
                            entity={documento}
                            colorType={"primary"}
                            icon={downloadOutline}
                            title={"Scarica"}
                        />
                        <ItemOption
                            handler={(documento) =>
                                isFileSelected(documento.id!)
                                    ? shareFile(
                                          currentFile!.byteArray,
                                          currentFile!.documento,
                                          presentAlert
                                      )
                                    : selectFile(documento.id!)
                            }
                            entity={documento}
                            colorType={
                                isFileSelected(documento.id!)
                                    ? "success"
                                    : "tertiary"
                            }
                            icon={
                                isFileSelected(documento.id!)
                                    ? shareOutline
                                    : checkmarkCircleOutline
                            }
                            title={
                                isFileSelected(documento.id!)
                                    ? "Condividi"
                                    : "Seleziona"
                            }
                        />
                        <ItemOption
                            handler={(documento) => {
                                props.setCurrentEntity(documento);
                                props.setMode("form");
                            }}
                            entity={documento}
                            colorType={"light"}
                            icon={createOutline}
                            title={"Rinomina"}
                        />
                        <ItemOption
                            handler={(documento) =>
                                props.deleteEntity(
                                    "documenti",
                                    documento.id!.toString(),
                                    `Hai selezionato la cancellazione del documento selezionato. Si tratta di un processo irreversibile.`
                                )
                            }
                            entity={documento}
                            colorType={"danger"}
                            icon={trashOutline}
                            title={"Elimina"}
                        />
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListDocumenti;
