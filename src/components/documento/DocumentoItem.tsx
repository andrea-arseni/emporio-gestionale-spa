import { IonItem, IonThumbnail, IonLabel } from "@ionic/react";
import { Documento } from "../../entities/documento.model";
import {
    getFileNameWithoutExtension,
    getFileType,
    getReportName,
} from "../../utils/fileUtils";
import word from "../../assets/word.png";
import excel from "../../assets/excel.png";
import text from "../../assets/txt.png";
import image from "../../assets/image.png";
import pdf from "../../assets/pdf.png";
import report from "../../assets/report.png";
import styles from "../lists/Lists.module.css";

const DocumentoItem: React.FC<{
    documento: Documento;
    selected: number;
    handleClick: (id: number) => void;
}> = (props) => {
    const type =
        props.documento.tipologia === "REPORT"
            ? "report"
            : getFileType(props.documento.nome!);

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

    return (
        <IonItem
            key={props.documento.id}
            onClick={() => props.handleClick(props.documento.id!)}
            color={props.documento?.id === props.selected ? "primary" : "light"}
        >
            <IonThumbnail slot="start" className={styles.border}>
                <img alt={type} src={getThumbnail(type)} />
            </IonThumbnail>
            <IonLabel
                color={
                    props.documento?.id === props.selected ? "light" : "dark"
                }
                text-wrap
            >
                <h2>
                    {`${
                        props.documento.tipologia === "REPORT"
                            ? "Report attività"
                            : getFileNameWithoutExtension(props.documento.nome!)
                    }`}
                </h2>
                {props.documento.tipologia === "REPORT" && (
                    <p
                        style={{
                            color:
                                props.documento?.id === props.selected
                                    ? "white"
                                    : "#1361f3",
                            fontWeight: "bold",
                        }}
                    >
                        {getReportName(props.documento.nome!)}
                    </p>
                )}
            </IonLabel>
        </IonItem>
    );
};

export default DocumentoItem;
