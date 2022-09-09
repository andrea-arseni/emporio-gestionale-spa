import { IonContent } from "@ionic/react";
import { cardOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import List from "../../components/list/List";
import FormOperation from "../../components/forms/operation-form/OperationForm";
import { Entity } from "../../entities/entity";
import { Operazione } from "../../entities/operazione.model";

const OperazioniPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentOperation, setCurrentOperation] = useState<Entity | null>(
        null
    );

    return (
        <div className="page">
            {mode === "list" && (
                <List
                    setMode={setMode}
                    setCurrentEntity={setCurrentOperation}
                    entitiesType="operazioni"
                    icon={cardOutline}
                    title="Nuova Operazione"
                />
            )}
            {mode === "form" && (
                <IonContent>
                    <FormTitle
                        title={
                            currentOperation?.id
                                ? "Modifica Operazione"
                                : "Crea Nuova Operazione"
                        }
                        handler={() => setMode("list")}
                        backToList
                    />
                    <FormOperation
                        setMode={setMode}
                        operation={currentOperation as Operazione}
                    />
                </IonContent>
            )}
        </div>
    );
};

export default OperazioniPage;
