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
    getReportName,
    openFile,
    shareFile,
} from "../../utils/fileUtils";
import styles from "./Lists.module.css";
import word from "../../assets/word.png";
import excel from "../../assets/excel.png";
import text from "../../assets/txt.png";
import image from "../../assets/image.png";
import pdf from "../../assets/pdf.png";
import report from "../../assets/report.png";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import ItemOption from "./ItemOption";
import { fileMode } from "../../pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";
import { isUserAdmin } from "../../utils/userUtils";
import { useAppSelector } from "../../hooks";
import { isNativeApp } from "../../utils/contactUtils";

const ListDocumenti: React.FC<{
    documenti: Documento[];
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    setMode?:
        | Dispatch<SetStateAction<"list" | "form">>
        | Dispatch<SetStateAction<fileMode>>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
    baseUrl: string;
    closeItems: () => void;
}> = (props) => {
    const [presentAlert] = useIonAlert();

    const [currentFile, setCurrentFile] = useState<{
        documento: Documento;
        byteArray: string;
    } | null>(null);

    const getThumbnail = (
        type: "report" | "image" | "word" | "excel" | "pdf" | "text" | "error"
    ) => {
        if (type === "report") return report;
        if (type === "image") return image;
        if (type === "excel") return excel;
        if (type === "pdf") return pdf;
        if (type === "text") return text;
        if (type === "word") return word;
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
            props.closeItems();
            openFile(currentFile!.byteArray, currentFile!.documento);
        } else {
            const res = await selectFile(documento.id!);
            props.closeItems();
            openFile(res.byteArray, res.file);
        }
    };

    const getFileAndDownload = async (documento: Documento) => {
        if (isFileSelected(documento.id!)) {
            props.closeItems();
            downloadFile(currentFile!.byteArray, currentFile!.documento);
        } else {
            const res = await selectFile(documento.id!);
            props.closeItems();
            downloadFile(res.byteArray, res.file);
        }
    };

    const shareThisFile = () => {
        props.closeItems();
        shareFile(currentFile!.byteArray, currentFile!.documento, presentAlert);
    };

    const userData = useAppSelector((state) => state.auth.userData);

    const getDocumento = (documento: Documento) => {
        const type =
            documento.tipologia === "REPORT"
                ? "report"
                : getFileType(documento.nome!);
        return (
            <IonItem key={documento.id} detail>
                <IonThumbnail slot="start" className={styles.border}>
                    <img alt={type} src={getThumbnail(type)} />
                </IonThumbnail>
                <IonLabel text-wrap>
                    <h2>
                        {`${
                            documento.tipologia === "REPORT"
                                ? "Report attività"
                                : getFileNameWithoutExtension(documento.nome!)
                        }`}
                    </h2>
                    {documento.tipologia === "REPORT" && (
                        <p style={{ color: "#1361f3", fontWeight: "bold" }}>
                            {getReportName(documento.nome!)}
                        </p>
                    )}
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
                        {(isNativeApp ||
                            getFileType(documento.nome!) === "image" ||
                            getFileType(documento.nome!) === "pdf" ||
                            getFileType(documento.nome!) === "text") && (
                            <ItemOption
                                handler={() => getFileAndOpen(documento)}
                                colorType={"dark"}
                                icon={openOutline}
                                title={"Leggi"}
                            />
                        )}
                        <ItemOption
                            handler={() => getFileAndDownload(documento)}
                            colorType={"primary"}
                            icon={downloadOutline}
                            title={"Scarica"}
                        />
                        <ItemOption
                            handler={() =>
                                isFileSelected(documento.id!)
                                    ? shareThisFile()
                                    : selectFile(documento.id!)
                            }
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
                        {props.setCurrentEntity &&
                            props.setMode &&
                            isUserAdmin(userData) && (
                                <ItemOption
                                    handler={() => {
                                        props.setCurrentEntity!(documento);
                                        props.setMode!("form");
                                    }}
                                    colorType={"light"}
                                    icon={createOutline}
                                    title={"Rinomina"}
                                />
                            )}
                        {isUserAdmin(userData) && (
                            <ItemOption
                                handler={() =>
                                    props.deleteEntity(
                                        "documenti",
                                        documento.id!.toString(),
                                        `Hai selezionato la cancellazione del documento selezionato. Si tratta di un processo irreversibile.`
                                    )
                                }
                                colorType={"danger"}
                                icon={trashOutline}
                                title={"Elimina"}
                            />
                        )}
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListDocumenti;
