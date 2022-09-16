import { IonContent } from "@ionic/react";
import { golfOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import LavoroForm from "../../components/forms/lavoro-form/Lavoro-form";
import List from "../../components/list/List";
import { Entity } from "../../entities/entity";
import { Lavoro } from "../../entities/lavoro.model";
import styles from "./LavoriPage.module.css";

const LavoriPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentLavoro, setCurrentLavoro] = useState<Entity | null>(null);

    const backToList = () => {
        setMode("list");
        setCurrentLavoro(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <List
                    setMode={setMode}
                    setCurrentEntity={setCurrentLavoro}
                    entitiesType="lavori"
                    icon={golfOutline}
                    title="Nuovo Obiettivo"
                />
            )}
            {mode === "form" && (
                <IonContent>
                    <div className={styles.fixed}>
                        <FormTitle
                            title={
                                currentLavoro?.id
                                    ? "Modifica Obiettivo"
                                    : "Nuovo Obiettivo"
                            }
                            handler={backToList}
                            backToList
                        />
                    </div>

                    <div className={styles.spaceDown}>
                        <LavoroForm
                            lavoro={
                                currentLavoro ? (currentLavoro as Lavoro) : null
                            }
                            backToList={backToList}
                        />
                    </div>
                </IonContent>
            )}
        </div>
    );
};

export default LavoriPage;
