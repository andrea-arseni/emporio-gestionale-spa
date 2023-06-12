import { IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { Documento } from "../../entities/documento.model";
import {
    getFileNameWithoutExtension,
    getFileType,
    getReportName,
} from "../../utils/fileUtils";
import styles from "./Lists.module.css";
import word from "../../assets/word.png";
import excel from "../../assets/excel.png";
import text from "../../assets/txt.png";
import image from "../../assets/image.png";
import pdf from "../../assets/pdf.png";
import report from "../../assets/report.png";
import { useAppDispatch } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import { setCurrentDocumento } from "../../store/documenti-slice";
import { useNavigate } from "react-router-dom";
import useUpAndDown from "../../hooks/use-up-and-down";

const ListDocumenti: React.FC<{
    documenti: Documento[];
}> = (props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentDocumento(null));
    }, [dispatch]);

    const navigate = useNavigate();

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.documenti, selected, defineSelected);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }

        dispatch(
            setCurrentDocumento(props.documenti.filter((el) => el.id === id)[0])
        );
        navigate(`${id.toString()}`);
    };

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

    const getDocumento = (documento: Documento) => {
        const type =
            documento.tipologia === "REPORT"
                ? "report"
                : getFileType(documento.nome!);
        return (
            <IonItem
                key={documento.id}
                onClick={() => handleClick(documento.id!)}
                color={documento?.id === selected ? "primary" : "light"}
            >
                <IonThumbnail slot="start" className={styles.border}>
                    <img alt={type} src={getThumbnail(type)} />
                </IonThumbnail>
                <IonLabel
                    color={documento?.id === selected ? "light" : "dark"}
                    text-wrap
                >
                    <h2>
                        {`${
                            documento.tipologia === "REPORT"
                                ? "Report attività"
                                : getFileNameWithoutExtension(documento.nome!)
                        }`}
                    </h2>
                    {documento.tipologia === "REPORT" && (
                        <p
                            style={{
                                color:
                                    documento?.id === selected
                                        ? "white"
                                        : "#1361f3",
                                fontWeight: "bold",
                            }}
                        >
                            {getReportName(documento.nome!)}
                        </p>
                    )}
                </IonLabel>
            </IonItem>
        );
    };

    return (
        <>
            {props.documenti.map((documento: Documento) =>
                getDocumento(documento)
            )}
        </>
    );
};

export default ListDocumenti;
