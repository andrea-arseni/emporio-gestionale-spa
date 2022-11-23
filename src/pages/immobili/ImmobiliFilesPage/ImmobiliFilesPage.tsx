import {
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    IonSegment,
    IonSegmentButton,
    useIonAlert,
} from "@ionic/react";
import {
    cameraOutline,
    documentsOutline,
    downloadOutline,
    podiumOutline,
    shareOutline,
    trashOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RiepilogoBar from "../../../components/bars/riepilogo-bar/RiepilogoBar";
import Card from "../../../components/card/Card";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import DocumentoForm from "../../../components/forms/documento-form/DocumentoForm";
import ImmobiliFiles from "../../../components/immobili-files/ImmobiliFiles";
import ImmobiliPhotos from "../../../components/immobili-photos/ImmobiliPhotos";
import ListDocumenti from "../../../components/lists/ListDocumenti";
import NewFileButton from "../../../components/new-file-button/NewFileButton";
import TwoDates from "../../../components/two-dates/TwoDates";
import { Documento } from "../../../entities/documento.model";
import { Entity } from "../../../entities/entity";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useList from "../../../hooks/use-list";
import { deleteFile } from "../../../store/immobile-slice";
import {
    fetchImmobileById,
    performRipristinaImmobile,
    performUpdateReports,
} from "../../../store/immobile-thunk";
import { changeLoading, setError } from "../../../store/ui-slice";
import { fileSpeciale } from "../../../types/file_speciali";
import axiosInstance from "../../../utils/axiosInstance";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import errorHandler from "../../../utils/errorHandler";
import {
    downloadMultipleFiles,
    shareMultipleFiles,
    sortReports,
    submitFile,
} from "../../../utils/fileUtils";
import { isUserAdmin } from "../../../utils/userUtils";
import styles from "./ImmobiliFilesPage.module.css";

export type fileMode = "files" | "foto" | "form" | "report";

const ImmobiliFilesPage: React.FC<{}> = () => {
    const location = useLocation();

    const userData = useAppSelector((state) => state.auth.userData);

    const navigate = useNavigate();

    const [presentAlert] = useIonAlert();

    const { list, closeItemsList } = useList();

    const inputFileRef = useRef<any>();

    const immobileId = location.pathname.split("/")[2];

    const [mode, setMode] = useState<fileMode>("files");

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    const [currentFileSpeciale, setCurrentFileSpeciale] =
        useState<fileSpeciale | null>(null);

    const [update, setUpdate] = useState<number>(0);

    const [selectionMode, setSelectionMode] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const loading = useAppSelector((state) => state.ui.isLoading);

    const error = useAppSelector((state) => state.ui.error);

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const [listIdPhotoSelected, setListIdPhotoSelected] = useState<
        number[] | null
    >(null);

    const [isLoading, setShowLoading] = useState<boolean>(false);

    const [isSelectingDates, setIsSelectingDates] = useState<boolean>(false);

    useEffect(() => {
        setShowLoading(loading);
    }, [loading]);

    useEffect(() => {
        dispatch(fetchImmobileById(+immobileId));
    }, [dispatch, immobileId, update]);

    useEffect(() => {
        if (!error) return;
        if (error.name === "fetchImmobileById") {
            errorHandler(
                error.object,
                () => {
                    navigate(-1);
                    dispatch(setError(null));
                },
                "Impossibile leggere i file dell'immobile",
                presentAlert
            );
        } else if (error.name === "fetchFileById") {
            errorHandler(
                error.object,
                () => dispatch(setError(null)),
                "Impossibile aprire la foto",
                presentAlert
            );
        } else if (error.name === "swapPhotoPositions") {
            errorHandler(
                error.object,
                () => dispatch(setError(null)),
                "Scambio di posizioni non riuscito",
                presentAlert
            );
        } else if (error.name === "createReport") {
            errorHandler(
                error.object,
                () => {
                    dispatch(setError(null));
                    setIsSelectingDates(false);
                },
                "Creazione Report non riuscita",
                presentAlert
            );
        } else if (error.name === "ripristinaImmobile") {
            errorHandler(
                error.object,
                () => dispatch(setError(null)),
                "Riattivazione immobile non riuscita",
                presentAlert
            );
        }
    }, [error, navigate, presentAlert, dispatch]);

    const alertEliminaFotoSelezionate = () => {
        // alert vuoi farlo davvero? E' irreversibile
        presentAlert({
            header: "Attenzione!",
            subHeader: `Hai selezionato la cancellazione di ${
                listIdPhotoSelected!.length
            } foto dell'immobile. Si tratta di un'operazione irreversibile.`,
            buttons: [
                {
                    text: "Conferma",
                    handler: () => eliminaFotoSelezionate(0),
                },
                {
                    text: "Indietro",
                    role: "cancel",
                },
            ],
        });
    };

    const confermaCancellazioneAvvenuta = () => {
        dispatch(changeLoading(false));
        setListIdPhotoSelected(null);
        setSelectionMode(false);
        presentAlert({
            header: "Cancellazione completata",
            subHeader: `La cancellazione delle foto è avvenuta con successo.`,
            buttons: [
                {
                    text: "Ok",
                    role: "cancel",
                },
            ],
        });
    };

    const eliminaFotoSelezionate = async (index: number) => {
        dispatch(changeLoading(true));
        if (index === listIdPhotoSelected!.length) {
            confermaCancellazioneAvvenuta();
            return;
        }
        let id = listIdPhotoSelected![index];
        try {
            await axiosInstance.delete(`/immobili/${immobileId}/files/${id}`);
            dispatch(deleteFile(id));
            ++index;
            eliminaFotoSelezionate(index);
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(
                e,
                () => {},
                `Procedura interrotta: eliminazione foto non riuscita`,
                presentAlert
            );
        }
    };

    useEffect(() => {
        if (!selectionMode) setListIdPhotoSelected(null);
    }, [selectionMode]);

    const backToList = () => {
        setMode("files");
        setCurrentDocumento(null);
    };

    const confirmDeleteEntity = async (id: string) => {
        const url = `/immobili/${immobileId}/files/${id}`;
        try {
            dispatch(changeLoading(true));
            await axiosInstance.delete(url);
            dispatch(changeLoading(false));
            dispatch(deleteFile(+id));
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(
                e,
                () => {},
                "Eliminazione non riuscita",
                presentAlert
            );
        }
    };

    const deleteEntity = (entityName: string, id: string, message?: string) => {
        presentAlert({
            header: "Attenzione!",
            subHeader: message ? message : "La cancellazione è irreversibile.",
            buttons: [
                {
                    text: "Conferma",
                    handler: () => confirmDeleteEntity(id),
                },
                {
                    text: "Indietro",
                    handler: () => closeItemsList(),
                },
            ],
        });
    };

    const getPhotoSelected = () => {
        return immobile!.files!.filter((file) =>
            listIdPhotoSelected?.find((id) => id === file.id)
        );
    };

    const fermaTutto = (mode: "scaricarle" | "condividerle") => {
        presentAlert({
            header: "Attenzione!",
            subHeader: `Alcune delle foto selezionate non erano presenti, pertanto l'operazione è stata annullata. Aspetta che le foto che hai selezionato siano visibili prima di ${mode}`,
            buttons: [
                {
                    text: "OK",
                    handler: () => setSelectionMode(false),
                },
            ],
        });
    };

    const condividiFotoSelezionate = () => {
        // get all file of photo selected
        const photoSelected = getPhotoSelected();
        const areAllThere = photoSelected.every((el) => !!el.base64String);
        if (!areAllThere) {
            fermaTutto("condividerle");
        } else {
            shareMultipleFiles(photoSelected, presentAlert);
        }
    };

    const scaricaFotoSelezionate = () => {
        const photoSelected = getPhotoSelected();
        const areAllThere = photoSelected.every((el) => !!el.base64String);
        if (!areAllThere) {
            fermaTutto("scaricarle");
        } else {
            downloadMultipleFiles(photoSelected, dispatch);
        }
    };

    if (!immobile) return <IonLoading cssClass="loader" isOpen={loading} />;

    const reports = immobile.files
        ? immobile.files.filter((el) => el.tipologia === "REPORT")
        : [];
    const files = immobile.files
        ? immobile.files.filter((el) => el.tipologia === "DOCUMENTO")
        : [];

    sortReports(reports);

    const pickFile = (input: fileSpeciale | null) => {
        inputFileRef.current.click();
        setCurrentFileSpeciale(input);
    };

    const isButtonDisabled =
        !listIdPhotoSelected || listIdPhotoSelected!.length === 0;

    const idImmobileClosed = immobile?.files?.find(
        (el) => el.nome === "0" && el.tipologia === "FOTO"
    )?.id;

    const ripristinaImmobile = () =>
        dispatch(performRipristinaImmobile(+immobileId));

    const creaReport = async (input: any) => {
        // react thunk
        dispatch(changeLoading(true));
        try {
            const reqBody = { from: input.startDate, to: input.endDate };
            await axiosSecondaryApi.post(
                `/immobili/${immobileId}/report`,
                reqBody
            );
            dispatch(changeLoading(false));
            setIsSelectingDates(false);
            dispatch(performUpdateReports(+immobileId));
        } catch (e) {
            dispatch(changeLoading(false));
            dispatch(setError({ name: "createReport", object: e }));
        }
    };

    const getSegment = () => {
        return !selectionMode ? (
            <IonSegment
                mode="ios"
                value={mode}
                onClick={(e) => setMode(e.currentTarget.value as fileMode)}
            >
                <IonSegmentButton mode="ios" value="files">
                    <IonIcon icon={documentsOutline} />
                    <IonLabel>File</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton mode="ios" value="foto">
                    <IonIcon icon={cameraOutline} />
                    <IonLabel>Foto</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton mode="ios" value="reports">
                    <IonIcon icon={podiumOutline} />
                    <IonLabel>Report</IonLabel>
                </IonSegmentButton>
            </IonSegment>
        ) : (
            <IonSegment mode="ios">
                <IonSegmentButton
                    disabled={isButtonDisabled}
                    value="download"
                    onClick={() => scaricaFotoSelezionate()}
                >
                    <IonIcon icon={downloadOutline} />
                    <IonLabel>Scarica</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                    disabled={isButtonDisabled}
                    value="share"
                    onClick={() => condividiFotoSelezionate()}
                >
                    <IonIcon icon={shareOutline} />
                    <IonLabel>Condividi</IonLabel>
                </IonSegmentButton>
                {isUserAdmin(userData) && (
                    <IonSegmentButton
                        disabled={isButtonDisabled}
                        value="delete"
                        onClick={() => alertEliminaFotoSelezionate()}
                    >
                        <IonIcon icon={trashOutline} />
                        <IonLabel>Elimina</IonLabel>
                    </IonSegmentButton>
                )}
            </IonSegment>
        );
    };

    return (
        <>
            {mode !== "form" && (
                <>
                    <IonLoading cssClass="loader" isOpen={isLoading} />
                    <RiepilogoBar
                        currentEntity={immobile}
                        tipologia={"immobile"}
                    />
                    <NewFileButton
                        mode={mode}
                        selectionMode={selectionMode}
                        listIdPhotoSelected={listIdPhotoSelected}
                        action={() =>
                            mode === "report"
                                ? setIsSelectingDates(true)
                                : mode === "foto" && idImmobileClosed
                                ? ripristinaImmobile()
                                : pickFile(null)
                        }
                    />
                    {!isSelectingDates && mode === "files" && (
                        <ImmobiliFiles
                            ref={list}
                            files={files}
                            pickFile={pickFile}
                            deleteEntity={deleteEntity}
                            showLoading={loading}
                            setUpdate={setUpdate}
                            setCurrentDocumento={setCurrentDocumento}
                            setMode={setMode}
                            setShowLoading={setShowLoading}
                            immobileId={immobileId}
                            closeItemsList={closeItemsList}
                        />
                    )}
                    {!isSelectingDates && mode === "foto" && (
                        <ImmobiliPhotos
                            selectionMode={selectionMode}
                            setSelectionMode={setSelectionMode}
                            listIdPhotoSelected={listIdPhotoSelected}
                            setListIdPhotoSelected={setListIdPhotoSelected}
                        />
                    )}
                    {!isSelectingDates && mode === "report" && (
                        <IonList ref={list} className={styles.list}>
                            <ListDocumenti
                                documenti={reports}
                                setCurrentEntity={setCurrentDocumento}
                                deleteEntity={deleteEntity}
                                setShowLoading={setShowLoading}
                                setUpdate={setUpdate}
                                baseUrl={`/immobili/${immobileId}/files`}
                                closeItems={closeItemsList}
                            />

                            {reports.length === 0 && (
                                <Card
                                    subTitle={`Questo immobile non ha report associati`}
                                    title={"Non sono ancora presenti report"}
                                />
                            )}
                        </IonList>
                    )}
                    {!isSelectingDates && getSegment()}
                    {isSelectingDates && (
                        <TwoDates
                            action={creaReport}
                            text="Crea Report"
                            limit={new Date()}
                            goBack
                            getBack={() => setIsSelectingDates(false)}
                        />
                    )}
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={"Rinomina File"}
                        handler={() => setMode("files")}
                        backToList
                    />
                    <DocumentoForm
                        documento={currentDocumento as Documento}
                        backToList={backToList}
                        baseUrl={`/immobili/${immobileId}/files`}
                    />
                </>
            )}
            <input
                style={{
                    display: "none",
                }}
                ref={inputFileRef}
                type="file"
                multiple
                accept={mode === "foto" ? "image/*" : undefined}
                onChange={(e) => {
                    submitFile(
                        e,
                        setShowLoading,
                        presentAlert,
                        `immobili/${immobile.id}/files`,
                        setUpdate,
                        mode === "files" ? "documento" : "foto",
                        currentFileSpeciale,
                        dispatch
                    );
                }}
            />
        </>
    );
};

export default ImmobiliFilesPage;
