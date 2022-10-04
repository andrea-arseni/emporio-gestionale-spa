import { IonContent } from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import ImmobileForm from "../../../components/forms/immobile-form/ImmobileForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import useQueryData from "../../../hooks/use-query-data";
import styles from "./ImmobiliPage.module.css";

const ImmobiliPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const queryData = useQueryData("immobili");

    const backToList = () => {
        setMode("list");
        setCurrentImmobile(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <NewEntityBar
                        entitiesType="immobili"
                        setMode={setMode}
                        icon={homeOutline}
                        title="Nuovo Immobile"
                    />
                    <Selector
                        setMode={setMode}
                        entitiesType="immobili"
                        setCurrentEntity={setCurrentImmobile}
                        queryData={queryData}
                    />
                </IonContent>
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
