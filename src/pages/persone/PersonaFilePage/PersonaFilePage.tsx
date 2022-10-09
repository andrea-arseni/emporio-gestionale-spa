import {
    IonButton,
    IonContent,
    IonIcon,
    IonLabel,
    IonList,
    IonLoading,
    useIonAlert,
} from "@ionic/react";
import { documentsOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import RiepilogoBar from "../../../components/bars/riepilogo-bar/RiepilogoBar";
import Card from "../../../components/card/Card";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import DocumentoForm from "../../../components/forms/documento-form/DocumentoForm";
import ListDocumenti from "../../../components/lists/ListDocumenti";
import PageFooter from "../../../components/page-footer/PageFooter";
import { Documento } from "../../../entities/documento.model";
import { Entity } from "../../../entities/entity";
import { Persona } from "../../../entities/persona.model";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";
import { submitFile } from "../../../utils/fileUtils";
import styles from "./PersonaFilePage.module.css";

const PersonaFilePage: React.FC<{}> = () => {
    const location = useLocation();

    const history = useHistory();

    const personaId = location.pathname.split("/")[2];

    const [mode, setMode] = useState<"list" | "form">("list");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const inputFileRef = useRef<any>();

    const [persona, setPersona] = useState<Persona | null>(null);

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    const [update, setUpdate] = useState<number>(0);

    const ionListRef = useRef<any>();

    const closeItems = () => ionListRef.current.closeSlidingItems();

    useEffect(() => {
        const fetchPersona = async () => {
            setShowLoading(true);
            try {
                const res = await axiosInstance.get("/persone/" + personaId);
                setPersona(res.data);
                setShowLoading(false);
            } catch (e) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => history.goBack(),
                    "Impossibile leggere i file della persona",
                    presentAlert
                );
            }
        };

        fetchPersona();
    }, [history, personaId, presentAlert, update]);

    const backToList = () => {
        setMode("list");
        setCurrentDocumento(null);
        setUpdate((prevValue) => ++prevValue);
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
                    handler: () => closeItems(),
                },
            ],
        });
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
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
                        onClick={() => inputFileRef.current.click()}
                    >
                        <IonIcon icon={documentsOutline} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Nuovo File
                        </IonLabel>
                    </IonButton>
                    <input
                        style={{
                            display: "none",
                        }}
                        ref={inputFileRef}
                        type="file"
                        onChange={(e) =>
                            submitFile(
                                e,
                                setShowLoading,
                                presentAlert,
                                `persone/${personaId}/files`,
                                setUpdate
                            )
                        }
                    />
                    {persona && persona.files && persona.files.length > 0 && (
                        <IonList className={`${styles.list} ${styles.simple}`}>
                            <ListDocumenti
                                documenti={persona.files as Documento[]}
                                setMode={setMode}
                                setCurrentEntity={setCurrentDocumento}
                                deleteEntity={deleteEntity}
                                showLoading={showLoading}
                                setShowLoading={setShowLoading}
                                setUpdate={setUpdate}
                                baseUrl={`/persone/${personaId}/files`}
                            />
                        </IonList>
                    )}
                    {(!persona ||
                        !persona.files ||
                        persona.files.length === 0) &&
                        !showLoading && (
                            <div className={`${styles.simple} centered`}>
                                <Card
                                    subTitle={`Questa persona non ha file associati`}
                                    title={
                                        "Non sono stati trovati risultati per la ricerca effettuata"
                                    }
                                />
                            </div>
                        )}
                    <PageFooter
                        page={0}
                        numberOfResults={
                            persona && persona.files && persona.files.length > 0
                                ? persona.files.length
                                : 0
                        }
                        simple
                    />
                </IonContent>
            )}
            {mode === "form" && (
                <IonContent>
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
                </IonContent>
            )}
        </div>
    );
};

export default PersonaFilePage;
