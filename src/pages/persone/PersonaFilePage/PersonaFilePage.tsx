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
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
    getFilesNonSpeciali,
    getFileSpeciale,
    isFileSpecialePresent,
    submitFile,
} from "../../../utils/fileUtils";
import styles from "./PersonaFilePage.module.css";
import useErrorHandler from "../../../hooks/use-error-handler";
import { closeIonSelect } from "../../../utils/closeIonSelect";
import DocumentoItem from "../../../components/documento/DocumentoItem";
import { useAppDispatch } from "../../../hooks";
import { setCurrentDocumento as setDocumento } from "../../../store/documenti-slice";

const PersonaFilePage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

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

    const { list } = useList();

    const { errorHandler } = useErrorHandler();

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
                    "Impossibile leggere i file della persona",
                    true
                );
            }
        };

        fetchPersona();

        return () => {
            mounted = false;
        };
    }, [navigate, personaId, presentAlert, update, errorHandler]);

    const backToList = () => {
        setMode("list");
        setCurrentDocumento(null);
        setUpdate((prevValue) => ++prevValue);
    };

    const pickFile = (input: fileSpeciale | null) => {
        setCurrentFileSpeciale(input);
        inputFileRef.current.click();
    };

    const dispatch = useAppDispatch();

    const [selected, setSelected] = useState<number>(0);

    const selectItem = useCallback(
        (id: number) => {
            dispatch(
                setDocumento(persona!.files!.filter((el) => el.id === id)[0])
            );
            navigate(`${id.toString()}`);
        },
        [dispatch, navigate, persona]
    );

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }
        selectItem(id);
    };

    const getItem = (input: fileSpeciale) => {
        return (
            <DocumentoItem
                documento={getFileSpeciale(persona!.files!, input)[0]}
                handleClick={handleClick}
                selected={selected}
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
                                errorHandler,
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
