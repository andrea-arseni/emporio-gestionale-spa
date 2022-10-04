import { IonContent } from "@ionic/react";
import { golfOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import LavoroForm from "../../../components/forms/lavoro-form/Lavoro-form";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Lavoro } from "../../../entities/lavoro.model";
import useQueryData from "../../../hooks/use-query-data";
import styles from "./LavoriPage.module.css";

const LavoriPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentLavoro, setCurrentLavoro] = useState<Entity | null>(null);

    const queryData = useQueryData("lavori");

    const backToList = () => {
        setMode("list");
        setCurrentLavoro(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <NewEntityBar
                        entitiesType="lavori"
                        setMode={setMode}
                        icon={golfOutline}
                        title="Nuovo Obiettivo"
                    />
                    <Selector
                        setMode={setMode}
                        entitiesType="lavori"
                        setCurrentEntity={setCurrentLavoro}
                        queryData={queryData}
                    />
                </IonContent>
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
