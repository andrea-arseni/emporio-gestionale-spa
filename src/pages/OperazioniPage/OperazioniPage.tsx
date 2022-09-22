import { IonContent } from "@ionic/react";
import { cardOutline } from "ionicons/icons";
import { useState } from "react";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import FormOperation from "../../components/forms/operation-form/OperationForm";
import { Entity } from "../../entities/entity";
import { Operazione } from "../../entities/operazione.model";
import Selector from "../../components/selector/Selector";
import NewEntityBar from "../../components/bars/new-entity-bar/NewEntityBar";
import useFilterAndSort from "../../hooks/use-query-data";

const OperazioniPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentOperation, setCurrentOperation] = useState<Entity | null>(
        null
    );

    const { filter, setFilter, sort, setSort, page, setPage } =
        useFilterAndSort("operazioni");

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <NewEntityBar
                        entitiesType="operazioni"
                        setMode={setMode}
                        icon={cardOutline}
                        title="Nuova Operazione"
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="operazioni"
                        setCurrentEntity={setCurrentOperation}
                        filter={filter}
                        setFilter={setFilter}
                        sort={sort}
                        setSort={setSort}
                        page={page}
                        setPage={setPage}
                    />
                </IonContent>
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
