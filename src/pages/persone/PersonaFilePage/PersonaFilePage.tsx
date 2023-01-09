import {
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    isPlatform,
    useIonAlert,
} from "@ionic/react";
import { documentsSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RiepilogoBar from "../../../components/bars/riepilogo-bar/RiepilogoBar";
import Card from "../../../components/card/Card";
import FormGroup from "../../../components/form-components/form-group/FormGroup";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import ItemSelector from "../../../components/form-components/item-selector/ItemSelector";
import DocumentoForm from "../../../components/forms/documento-form/DocumentoForm";
import ListDocumenti from "../../../components/lists/ListDocumenti";
import PageFooter from "../../../components/page-footer/PageFooter";
import { Documento } from "../../../entities/documento.model";
import { Entity } from "../../../entities/entity";
import { Persona } from "../../../entities/persona.model";
import useList from "../../../hooks/use-list";
import { fileSpeciale } from "../../../types/file_speciali";
import axiosInstance from "../../../utils/axiosInstance";
import { isNativeApp } from "../../../utils/contactUtils";
import errorHandler from "../../../utils/errorHandler";
import {
    getFilesNonSpeciali,
    getFileSpeciale,
    isFileSpecialePresent,
    submitFile,
} from "../../../utils/fileUtils";
import styles from "./PersonaFilePage.module.css";

const PersonaFilePage: React.FC<{}> = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const personaId = location.pathname.split("/")[2];

    const [mode, setMode] = useState<"list" | "form">("list");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const inputFileRef = useRef<any>();

    const [persona, setPersona] = useState<Persona | null>(null);

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    const [currentFileSpeciale, setCurrentFileSpeciale] =
        useState<fileSpeciale | null>(null);

    const [update, setUpdate] = useState<number>(0);

    const { list, closeItemsList } = useList();

    useEffect(() => {
        let mounted = true;

        const fetchPersona = async () => {
            setShowLoading(true);
            try {
                const res = await axiosInstance.get("/persone/" + personaId);
                if (!mounted) return;
                setPersona(res.data);
                setShowLoading(false);
            } catch (e) {
                if (!mounted) return;
                setShowLoading(false);
                errorHandler(
                    e,
                    () => navigate(-1),
                    "Impossibile leggere i file della persona",
                    presentAlert
                );
            }
        };

        fetchPersona();

        return () => {
            mounted = false;
        };
    }, [navigate, personaId, presentAlert, update]);

    const backToList = () => {
        setMode("list");
        setCurrentDocumento(null);
        setUpdate((prevValue) => ++prevValue);
    };

    const pickFile = (input: fileSpeciale | null) => {
        setCurrentFileSpeciale(input);
        inputFileRef.current.click();
    };

    const confirmDeleteEntity = async (id: string) => {
        const url = `/persone/${personaId}/files/${id}`;
        try {
            setShowLoading(true);
            await axiosInstance.delete(url);
            setShowLoading(false);
            setUpdate((oldNumber) => ++oldNumber);
        } catch (e) {
            setShowLoading(false);
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

    const getItem = (input: fileSpeciale) => {
        return (
            <ListDocumenti
                documenti={getFileSpeciale(persona!.files!, input)}
                deleteEntity={deleteEntity}
                setShowLoading={setShowLoading}
                baseUrl={`/persone/${personaId}/files`}
                closeItems={closeItemsList}
            />
        );
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <IonLoading cssClass="loader" isOpen={showLoading} />
                    {persona && (
                        <RiepilogoBar
                            currentEntity={persona}
                            tipologia={"persona"}
                        />
                    )}
                    <IonButton
                        color="primary"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        style={{ margin: 0 }}
                        onClick={() => pickFile(null)}
                    >
                        <IonIcon icon={documentsSharp} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Nuovi File
                        </IonLabel>
                    </IonButton>
                    <input
                        style={{
                            display: "none",
                        }}
                        ref={inputFileRef}
                        multiple
                        type="file"
                        onChange={(e) =>
                            submitFile(
                                e,
                                setShowLoading,
                                presentAlert,
                                `persone/${personaId}/files`,
                                setUpdate,
                                undefined,
                                currentFileSpeciale
                            )
                        }
                    />
                    <IonList
                        ref={list}
                        className={`${
                            isNativeApp && isPlatform("ios")
                                ? styles.iosList
                                : styles.list
                        }`}
                    >
                        <ItemSelector
                            color
                            titoloGruppo={"Documento Identificativo"}
                            titoloBottone={"Aggiungi Identificativo"}
                            isItemPresent={isFileSpecialePresent(
                                persona && persona.files ? persona.files : [],
                                "documento-identità"
                            )}
                            getItem={() => getItem("documento-identità")}
                            openSelector={() => {
                                pickFile("documento-identità");
                            }}
                        />
                        <FormGroup
                            title={`${"Altri file"} : ${
                                getFilesNonSpeciali(
                                    persona && persona.files
                                        ? persona.files
                                        : [],
                                    "persona"
                                ).length === 0
                                    ? "Non presenti"
                                    : getFilesNonSpeciali(
                                          persona && persona.files
                                              ? persona.files
                                              : [],
                                          "persona"
                                      ).length
                            }`}
                        >
                            {persona &&
                                persona.files &&
                                persona.files.length > 0 && (
                                    <ListDocumenti
                                        documenti={getFilesNonSpeciali(
                                            persona.files,
                                            "persona"
                                        )}
                                        setMode={setMode}
                                        setCurrentEntity={setCurrentDocumento}
                                        setShowLoading={setShowLoading}
                                        baseUrl={`/persone/${personaId}/files`}
                                        closeItems={closeItemsList}
                                        deleteEntity={deleteEntity}
                                    />
                                )}
                            {(!persona ||
                                !persona.files ||
                                persona.files.length === 0) && (
                                <div className={`centered`}>
                                    <Card
                                        subTitle={`Questa persona non ha file associati`}
                                        title={
                                            "Non sono stati trovati risultati per la ricerca effettuata"
                                        }
                                    />
                                </div>
                            )}
                        </FormGroup>
                    </IonList>

                    <PageFooter
                        page={0}
                        numberOfResults={
                            persona && persona.files && persona.files.length > 0
                                ? persona.files.length
                                : 0
                        }
                        simple
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentDocumento ? "Rinomina File" : "Nuovo File"
                        }
                        handler={() => setMode("list")}
                        backToList
                    />
                    <DocumentoForm
                        documento={currentDocumento as Documento}
                        backToList={backToList}
                        baseUrl={`/persone/${personaId}/files`}
                    />
                </>
            )}
        </>
    );
};

export default PersonaFilePage;
