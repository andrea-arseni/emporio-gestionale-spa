import { IonContent } from "@ionic/react";
import { peopleOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import List from "../../components/list/List";
import { Entity } from "../../entities/entity";
import styles from "./PersonaPage.module.css";

const PersonaPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentPersona, setCurrentPersona] = useState<Entity | null>(null);

    const backToList = () => {
        setMode("list");
        setCurrentPersona(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <List
                    setMode={setMode}
                    setCurrentEntity={setCurrentPersona}
                    entitiesType="persone"
                    icon={peopleOutline}
                    title="Nuova Persona"
                />
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
                        PERSONA FORM
                        {/* <ImmobileForm
                            immobile={
                                currentPersona
                                    ? (currentPersona as Immobile)
                                    : null
                            }
                            backToList={backToList}
                        /> */}
                    </div>
                </IonContent>
            )}
        </div>
    );
};

export default PersonaPage;
