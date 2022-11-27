import { IonList, isPlatform } from "@ionic/react";
import React, { Dispatch, SetStateAction } from "react";
import { Documento } from "../../entities/documento.model";
import { Entity } from "../../entities/entity";
import { fileMode } from "../../pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";
import { fileSpeciale } from "../../types/file_speciali";
import { isNativeApp } from "../../utils/contactUtils";
import {
    getFilesNonSpeciali,
    getFileSpeciale,
    isFileSpecialePresent,
} from "../../utils/fileUtils";
import Card from "../card/Card";
import FormGroup from "../form-components/form-group/FormGroup";
import ItemSelector from "../form-components/item-selector/ItemSelector";
import ListDocumenti from "../lists/ListDocumenti";
import styles from "./ImmobiliFiles.module.css";

export default React.forwardRef<
    {
        files: Documento[];
        pickFile: (input: any) => void;
        deleteEntity: () => void;
        showLoading: boolean;
        setUpdate: Dispatch<SetStateAction<number>>;
        setCurrentDocumento: Dispatch<SetStateAction<Entity | null>>;
        setMode: Dispatch<SetStateAction<fileMode>>;
        setShowLoading: Dispatch<SetStateAction<boolean>>;
        immobileId: number;
        closeItemsList: () => void;
    },
    any
>(
    (
        props: {
            files: Documento[];
            pickFile: (input: any) => void;
            deleteEntity: () => void;
            showLoading: boolean;
            setUpdate: Dispatch<SetStateAction<number>>;
            setCurrentDocumento: Dispatch<SetStateAction<Entity | null>>;
            setMode: Dispatch<SetStateAction<fileMode>>;
            setShowLoading: Dispatch<SetStateAction<boolean>>;
            immobileId: number;
            closeItemsList: () => void;
        },
        ref: any
    ) => {
        const getItem = (input: fileSpeciale) => {
            return (
                <ListDocumenti
                    documenti={getFileSpeciale(props.files, input)}
                    deleteEntity={props.deleteEntity}
                    setShowLoading={props.setShowLoading}
                    setUpdate={props.setUpdate}
                    baseUrl={`/immobili/${props.immobileId}/files`}
                    closeItems={props.closeItemsList}
                />
            );
        };

        return (
            <IonList
                ref={ref}
                className={`${
                    isNativeApp && isPlatform("ios")
                        ? styles.iosList
                        : styles.list
                }`}
            >
                <ItemSelector
                    color
                    titoloGruppo={"Planimetria"}
                    titoloBottone={"Aggiungi Planimetria"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "planimetria-catastale"
                    )}
                    getItem={() => getItem("planimetria-catastale")}
                    openSelector={() => props.pickFile("planimetria-catastale")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"Visura"}
                    titoloBottone={"Aggiungi Visura"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "visura-catastale"
                    )}
                    getItem={() => getItem("visura-catastale")}
                    openSelector={() => props.pickFile("visura-catastale")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"Rogito"}
                    titoloBottone={"Aggiungi Rogito"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "atto-provenienza"
                    )}
                    getItem={() => getItem("atto-provenienza")}
                    openSelector={() => props.pickFile("atto-provenienza")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"APE"}
                    titoloBottone={"Aggiungi APE"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "certificazione-energetica"
                    )}
                    getItem={() => getItem("certificazione-energetica")}
                    openSelector={() =>
                        props.pickFile("certificazione-energetica")
                    }
                />
                <ItemSelector
                    color
                    titoloGruppo={"Consuntivo Spese Condominiali"}
                    titoloBottone={"Aggiungi Consuntivo Spese"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "consuntivo-spese"
                    )}
                    getItem={() => getItem("consuntivo-spese")}
                    openSelector={() => props.pickFile("consuntivo-spese")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"Contratto di Esclusiva"}
                    titoloBottone={"Aggiungi Esclusiva"}
                    isItemPresent={isFileSpecialePresent(
                        props.files,
                        "contratto-collaborazione"
                    )}
                    getItem={() => getItem("contratto-collaborazione")}
                    openSelector={() =>
                        props.pickFile("contratto-collaborazione")
                    }
                />
                <FormGroup
                    title={`${"Altri file (opzionali) "} : ${
                        getFilesNonSpeciali(props.files, "immobile").length ===
                        0
                            ? "Non presenti"
                            : getFilesNonSpeciali(props.files, "immobile")
                                  .length
                    }`}
                >
                    <ListDocumenti
                        documenti={
                            getFilesNonSpeciali(
                                props.files,
                                "immobile"
                            ) as Documento[]
                        }
                        setMode={props.setMode}
                        setCurrentEntity={props.setCurrentDocumento}
                        deleteEntity={props.deleteEntity}
                        setShowLoading={props.setShowLoading}
                        setUpdate={props.setUpdate}
                        baseUrl={`/immobili/${props.immobileId}/files`}
                        closeItems={props.closeItemsList}
                    />
                </FormGroup>
                {props.files.length === 0 && (
                    <Card
                        subTitle={`Questo immobile non ha ancora file associati`}
                        title={"Non sono ancora presenti file"}
                    />
                )}
            </IonList>
        );
    }
);
