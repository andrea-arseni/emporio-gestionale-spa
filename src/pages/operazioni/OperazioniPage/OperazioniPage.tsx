import { cardOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import FormOperation from "../../../components/forms/operation-form/OperationForm";
import { Entity } from "../../../entities/entity";
import { Operazione } from "../../../entities/operazione.model";
import Selector from "../../../components/selector/Selector";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const OperazioniPage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentOperation, setCurrentOperation] = useState<Entity | null>(
        null
    );

    const backToList = () => {
        setMode("list");
        setCurrentOperation(null);
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <NewEntityBar
                        setMode={setMode}
                        icon={cardOutline}
                        title="Nuova Operazione"
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="operazioni"
                        setCurrentEntity={setCurrentOperation}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentOperation?.id
                                ? "Modifica Operazione"
                                : "Crea Nuova Operazione"
                        }
                        handler={backToList}
                        backToList
                    />
                    <FormOperation
                        backToList={backToList}
                        operation={currentOperation as Operazione}
                    />
                </>
            )}
        </>
    );
};

export default OperazioniPage;
