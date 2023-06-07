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
import {
    deleteFile,
    setIsSelectionModeActivated,
    setListIdPhotoSelected,
} from "../../../store/immobile-slice";
import {
    fetchImmobileById,
    performRipristinaImmobile,
    performUpdateReports,
} from "../../../store/immobile-thunk";
import { changeLoading, setError } from "../../../store/ui-slice";
import { fileSpeciale } from "../../../types/file_speciali";
import axiosInstance from "../../../utils/axiosInstance";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import {
    downloadMultipleFiles,
    shareMultipleFiles,
    sortReports,
    submitFile,
} from "../../../utils/fileUtils";
import { isUserAdmin } from "../../../utils/userUtils";
import styles from "./ImmobiliFilesPage.module.css";
import useErrorHandler from "../../../hooks/use-error-handler";
import { closeIonSelect } from "../../../utils/closeIonSelect";

export type fileMode = "files" | "foto" | "form" | "report";

const ImmobiliFilesPage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

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

    const isSelectionModeActivated = useAppSelector(
        (state) => state.immobile.isSelectionModeActivated
    );

    const dispatch = useAppDispatch();

    const { errorHandler } = useErrorHandler();

    useEffect(() => {
        dispatch(setIsSelectionModeActivated(false));
    }, [dispatch]);

    const loading = useAppSelector((state) => state.ui.isLoading);

    const error = useAppSelector((state) => state.ui.error);

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const listIdPhotoSelected = useAppSelector(
        (state) => state.immobile.listIdPhotoSelected
    );

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
                "Impossibile leggere i file dell'immobile",
                true
            );
        } else if (error.name === "swapPhotoPositions") {
            errorHandler(error.object, "Scambio di posizioni non riuscito");
        } else if (error.name === "createReport") {
            errorHandler(error.object, "Creazione Report non riuscita");
        } else if (error.name === "ripristinaImmobile") {
            errorHandler(error.object, "Riattivazione immobile non riuscita");
        }
    }, [error, navigate, presentAlert, dispatch, errorHandler]);

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
        dispatch(setListIdPhotoSelected([]));
        dispatch(setIsSelectionModeActivated(false));
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
                `Procedura interrotta: eliminazione foto non riuscita`
            );
        }
    };

    useEffect(() => {
        if (!isSelectionModeActivated) dispatch(setListIdPhotoSelected([]));
    }, [isSelectionModeActivated, dispatch]);

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
            errorHandler(e, "Eliminazione non riuscita");
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

    const alertNotAllSelectedPhotoAreAvailable = () => {
        presentAlert({
            header: "Attenzione!",
            subHeader: `Alcune delle foto selezionate non erano presenti, pertanto l'operazione è stata annullata. Prova a uscire e poi tornare su questa pagina`,
            buttons: [
                {
                    text: "OK",
                    handler: () => dispatch(setIsSelectionModeActivated(false)),
                },
            ],
        });
    };

    const selezionaAzioneDaCompiereSulleFoto = (
        tipoAzione: "condividi" | "scarica"
    ) => {
        const photoSelected = getPhotoSelected();
        const areAllThere = photoSelected.every((el) => !!el.base64String);
        if (!areAllThere) {
            alertNotAllSelectedPhotoAreAvailable();
            return;
        }
        if (tipoAzione === "condividi") {
            shareMultipleFiles(photoSelected, errorHandler);
        } else if (tipoAzione === "scarica") {
            selezionaTipoDiFoto(photoSelected);
        }
    };

    const selezionaTipoDiFoto = (photoSelected: Documento[]) => {
        presentAlert({
            header: "Seleziona tipo foto",
            message: "Che tipo di foto vuoi scaricare?",
            buttons: [
                {
                    text: "Con il logo",
                    handler: () => {
                        downloadMultipleFiles(
                            photoSelected,
                            dispatch,
                            immobileId,
                            errorHandler,
                            `SIGNED`
                        );
                    },
                },
                {
                    text: "Originali",
                    handler: () => {
                        downloadMultipleFiles(
                            photoSelected,
                            dispatch,
                            immobileId,
                            errorHandler,
                            `ORIGINAL`
                        );
                    },
                },
            ],
        });
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

    const getSegment = (isSelectionModeActivated: boolean) => {
        return !isSelectionModeActivated ? (
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
                <IonSegmentButton mode="ios" value="report">
                    <IonIcon icon={podiumOutline} />
                    <IonLabel>Report</IonLabel>
                </IonSegmentButton>
            </IonSegment>
        ) : (
            <IonSegment mode="ios">
                <IonSegmentButton
                    disabled={isButtonDisabled}
                    value="download"
                    onClick={() =>
                        selezionaAzioneDaCompiereSulleFoto("scarica")
                    }
                >
                    <IonIcon icon={downloadOutline} />
                    <IonLabel>Scarica</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                    disabled={isButtonDisabled}
                    value="share"
                    onClick={() =>
                        selezionaAzioneDaCompiereSulleFoto("condividi")
                    }
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
                    {!isSelectingDates && mode === "foto" && <ImmobiliPhotos />}
                    {!isSelectingDates && mode === "report" && (
                        <IonList ref={list} className={styles.list}>
                            <ListDocumenti
                                documenti={reports}
                                setCurrentEntity={setCurrentDocumento}
                                deleteEntity={deleteEntity}
                                setShowLoading={setShowLoading}
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
                    {!isSelectingDates && getSegment(isSelectionModeActivated)}
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
                        errorHandler,
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
