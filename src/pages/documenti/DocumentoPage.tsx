import { IonButton, IonIcon, IonSpinner, isPlatform } from "@ionic/react";
import {
    createOutline,
    trashBinOutline,
    backspaceOutline,
    openOutline,
    downloadOutline,
    shareOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SinglePageData from "../../components/single-page-component/SinglePageData";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useDeleteEntity from "../../hooks/use-delete-entity";
import useWindowSize from "../../hooks/use-size";
import { closeIonSelect } from "../../utils/closeIonSelect";
import { getDayName } from "../../utils/timeUtils";
import { isUserAdmin } from "../../utils/userUtils";
import { isNativeApp } from "../../utils/contactUtils";
import {
    downloadFile,
    getBase64StringFromByteArray,
    getFileNameWithoutExtension,
    getFileType,
    getReportName,
    openFile,
    shareFile,
} from "../../utils/fileUtils";
import axiosInstance from "../../utils/axiosInstance";
import { setCurrentDocumento } from "../../store/documenti-slice";
import useErrorHandler from "../../hooks/use-error-handler";
import { Documento } from "../../entities/documento.model";
import { capitalize } from "../../utils/stringUtils";
import { listFileSpeciali } from "../../types/file_speciali";

const DocumentoPage: React.FC<{}> = () => {
    const documento = useAppSelector(
        (state) => state.documento.currentDocumento
    );
    const dispatch = useAppDispatch();

    const location = useLocation();

    const { errorHandler } = useErrorHandler();

    useEffect(() => {
        closeIonSelect();
    }, []);

    const isFileOpenable =
        (isNativeApp ||
            getFileType(documento?.nome!) === "image" ||
            getFileType(documento?.nome!) === "pdf" ||
            getFileType(documento?.nome!) === "text") &&
        !isPlatform("mobileweb");

    useEffect(() => {
        const selectFile = async () => {
            try {
                const res = await axiosInstance.get(location.pathname);
                if (res.data && res.data.file) {
                    const documento = new Documento(
                        res.data.file.id,
                        res.data.file.nome,
                        res.data.file.tipologia,
                        res.data.file.codiceBucket,
                        res.data.file.immobile,
                        res.data.file.persona,
                        getBase64StringFromByteArray(
                            res.data.byteArray,
                            res.data.file.nome
                        ),
                        res.data.tipoFile,
                        res.data.contentSize,
                        res.data.dataCreazione
                    );
                    dispatch(setCurrentDocumento(documento));
                }
            } catch (e) {
                errorHandler(e, "Lettura del file non riuscita");
            }
        };

        selectFile();
    }, [errorHandler, dispatch, location.pathname]);

    const navigate = useNavigate();

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => navigate(-1);

    const { deleteEntity } = useDeleteEntity();

    const [width] = useWindowSize();

    const leggiFile = () => openFile(documento!);

    const scaricaFile = () => downloadFile(documento!);

    const condividiFile = () => shareFile(documento!, errorHandler);

    const rinominaFile = () => navigate("modifica");

    const eliminaFile = () => {
        deleteEntity(location.pathname, "");
    };

    const isFileSpeciale = (name: string) => {
        // check if immobile o persona else null
        if (
            !location.pathname.includes("persone") &&
            !location.pathname.includes("immobili")
        )
            return false;
        // if immobile o persona retrieve list
        if (
            location.pathname.includes("immobili") ||
            location.pathname.includes("persone")
        ) {
            const nameArray = name.split(".");
            nameArray.pop();
            name = nameArray.join(".");

            return listFileSpeciali
                .filter(
                    (el) =>
                        el.type ===
                        (location.pathname.includes("immobili")
                            ? "immobile"
                            : "persona")
                )
                .map((el) => el.fileSpeciale.toString())
                .includes(name);
        }
    };

    return (
        <div className="singlePageFrame">
            <div className="singlePageInnerFrame">
                <SinglePageData chiave="Nome file">
                    {documento?.tipologia === "REPORT"
                        ? `Report ${getReportName(documento.nome!)}`
                        : getFileNameWithoutExtension(documento?.nome!)}
                </SinglePageData>
                {!documento?.tipoFile && (
                    <IonSpinner
                        color="primary"
                        style={{ marginTop: "20px" }}
                    ></IonSpinner>
                )}
                {documento?.tipoFile && (
                    <SinglePageData chiave="Tipo file">
                        {capitalize(documento?.tipoFile)}
                    </SinglePageData>
                )}
                {documento?.contentSize && (
                    <SinglePageData chiave="Dimensione">
                        {documento?.contentSize}
                    </SinglePageData>
                )}
                {documento?.dataCreazione && (
                    <SinglePageData chiave="Creato il">
                        {getDayName(
                            new Date(documento.dataCreazione),
                            width > 500 ? "medium" : "short"
                        )}
                    </SinglePageData>
                )}

                <br />
                <br />
                {isFileOpenable && documento?.base64String && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="primary"
                        mode="ios"
                        fill="solid"
                        onClick={leggiFile}
                    >
                        <IonIcon className="rightSpace" icon={openOutline} />
                        Leggi
                    </IonButton>
                )}
                {documento?.base64String && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="secondary"
                        mode="ios"
                        fill="solid"
                        onClick={scaricaFile}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={downloadOutline}
                        />
                        Scarica
                    </IonButton>
                )}
                {documento?.base64String && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="success"
                        mode="ios"
                        fill="solid"
                        onClick={condividiFile}
                    >
                        <IonIcon className="rightSpace" icon={shareOutline} />
                        Condividi
                    </IonButton>
                )}
                {!isFileSpeciale(documento?.nome!) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="tertiary"
                        mode="ios"
                        fill="solid"
                        onClick={rinominaFile}
                    >
                        <IonIcon className="rightSpace" icon={createOutline} />
                        Rinomina
                    </IonButton>
                )}
                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        mode="ios"
                        fill="solid"
                        onClick={eliminaFile}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella Documento
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="medium"
                    mode="ios"
                    fill="solid"
                    onClick={navigateBack}
                >
                    <IonIcon className="rightSpace" icon={backspaceOutline} />
                    Torna Indietro
                </IonButton>
            </div>
        </div>
    );
};

export default DocumentoPage;
