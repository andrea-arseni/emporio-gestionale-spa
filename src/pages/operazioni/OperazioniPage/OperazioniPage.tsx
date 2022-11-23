import { cardOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import FormOperation from "../../../components/forms/operation-form/OperationForm";
import { Entity } from "../../../entities/entity";
import { Operazione } from "../../../entities/operazione.model";
import Selector from "../../../components/selector/Selector";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import useQueryData from "../../../hooks/use-query-data";

const OperazioniPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentOperation, setCurrentOperation] = useState<Entity | null>(
        null
    );

    const backToList = () => {
        setMode("list");
        setCurrentOperation(null);
    };

    const queryData = useQueryData("operazioni");

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
                        queryData={queryData}
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
                        setMode={setMode}
                        operation={currentOperation as Operazione}
                    />
                </>
            )}
        </>
    );
};

export default OperazioniPage;
