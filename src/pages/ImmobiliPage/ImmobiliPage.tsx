import { IonContent } from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import ImmobileForm from "../../components/forms/immobile-form/ImmobileForm";
import List from "../../components/list/List";
import { Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import styles from "./ImmobiliPage.module.css";

const ImmobiliPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const backToList = () => {
        setMode("list");
        setCurrentImmobile(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <List
                    setMode={setMode}
                    setCurrentEntity={setCurrentImmobile}
                    entitiesType="immobili"
                    icon={homeOutline}
                    title="Nuovo Immobile"
                />
            )}
            {mode === "form" && (
                <IonContent>
                    <div className={styles.fixed}>
                        <FormTitle
                            title={
                                currentImmobile?.id
                                    ? "Modifica Immobile"
                                    : "Nuovo Immobile"
                            }
                            handler={backToList}
                            backToList
                        />
                    </div>
                    <div className={styles.spaceDown}>
                        <ImmobileForm
                            immobile={
                                currentImmobile
                                    ? (currentImmobile as Immobile)
                                    : null
                            }
                            backToList={backToList}
                        />
                    </div>
                </IonContent>
            )}
        </div>
    );
};

export default ImmobiliPage;
