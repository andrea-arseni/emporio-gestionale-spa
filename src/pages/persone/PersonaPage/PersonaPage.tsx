import { IonContent } from "@ionic/react";
import { peopleOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import PersoneForm from "../../../components/forms/persone-form/PersoneForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Persona } from "../../../entities/persona.model";
import useQueryData from "../../../hooks/use-query-data";
import styles from "./PersonaPage.module.css";

const PersonaPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentPersona, setCurrentPersona] = useState<Entity | null>(null);

    const queryData = useQueryData("persone");

    const backToList = () => {
        setMode("list");
        setCurrentPersona(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <NewEntityBar
                        entitiesType="persone"
                        setMode={setMode}
                        icon={peopleOutline}
                        title="Nuova Persona"
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="persone"
                        setCurrentEntity={setCurrentPersona}
                        queryData={queryData}
                    />
                </IonContent>
            )}
            {mode === "form" && (
                <IonContent>
                    <div className={styles.fixed}>
                        <FormTitle
                            title={
                                currentPersona?.id
                                    ? "Modifica Persona"
                                    : "Nuova Persona"
                            }
                            handler={backToList}
                            backToList
                        />
                    </div>
                    <div className={styles.spaceDown}>
                        <PersoneForm
                            persona={currentPersona as Persona}
                            setCurrentPersona={setCurrentPersona}
                            backToList={backToList}
                        />
                    </div>
                </IonContent>
            )}
        </div>
    );
};

export default PersonaPage;
