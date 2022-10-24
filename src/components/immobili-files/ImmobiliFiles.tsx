import { IonList } from "@ionic/react";
import React, { Dispatch, SetStateAction } from "react";
import { Documento } from "../../entities/documento.model";
import { Entity } from "../../entities/entity";
import { fileMode } from "../../pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";
import { fileSpeciale, listFileSpeciali } from "../../types/file_speciali";
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
        const getFileSpeciale = (input: fileSpeciale) =>
            props.files.filter((el: Documento) => el.nome?.includes(input));

        const getItem = (input: fileSpeciale) => {
            return (
                <ListDocumenti
                    documenti={getFileSpeciale(input)}
                    deleteEntity={props.deleteEntity}
                    setShowLoading={props.setShowLoading}
                    setUpdate={props.setUpdate}
                    baseUrl={`/immobili/${props.immobileId}/files`}
                    closeItems={props.closeItemsList}
                />
            );
        };

        const isFileSpecialePresent = (input: fileSpeciale) =>
            getFileSpeciale(input).length > 0;

        const getFilesNonSpeciali = () => {
            // per ogni file presente
            return props.files.filter((filePresente: Documento) => {
                // per ogni file speciale
                return listFileSpeciali.every((fileSpeciale) => {
                    // se il presente include lo speciale togli
                    return !filePresente.nome?.includes(fileSpeciale);
                });
            });
        };

        return (
            <IonList ref={ref} className={`${styles.list} ${styles.simple}`}>
                <ItemSelector
                    color
                    titoloGruppo={"Planimetria"}
                    titoloBottone={"Aggiungi Planimetria"}
                    isItemPresent={isFileSpecialePresent(
                        "planimetria-catastale"
                    )}
                    getItem={() => getItem("planimetria-catastale")}
                    openSelector={() => props.pickFile("planimetria-catastale")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"Visura"}
                    titoloBottone={"Aggiungi Visura"}
                    isItemPresent={isFileSpecialePresent("visura-catastale")}
                    getItem={() => getItem("visura-catastale")}
                    openSelector={() => props.pickFile("visura-catastale")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"Rogito"}
                    titoloBottone={"Aggiungi Rogito"}
                    isItemPresent={isFileSpecialePresent("atto-provenienza")}
                    getItem={() => getItem("atto-provenienza")}
                    openSelector={() => props.pickFile("atto-provenienza")}
                />
                <ItemSelector
                    color
                    titoloGruppo={"APE"}
                    titoloBottone={"Aggiungi APE"}
                    isItemPresent={isFileSpecialePresent(
                        "certificazione-energetica"
                    )}
                    getItem={() => getItem("certificazione-energetica")}
                    openSelector={() =>
                        props.pickFile("certificazione-energetica")
                    }
                />
                <FormGroup
                    title={`${"Altri file (opzionali) "} : ${
                        getFilesNonSpeciali().length === 0
                            ? "Non presenti"
                            : getFilesNonSpeciali().length
                    }`}
                >
                    <ListDocumenti
                        documenti={getFilesNonSpeciali() as Documento[]}
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
