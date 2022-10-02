import { IonContent } from "@ionic/react";
import { documentsOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import useQueryData from "../../../hooks/use-query-data";

const DocumentiPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const { filter, setFilter, sort, setSort, page, setPage } =
        useQueryData("documenti");

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <NewEntityBar
                        entitiesType="documenti"
                        setMode={setMode}
                        icon={documentsOutline}
                        title="Nuovo Documento"
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="documenti"
                        setCurrentEntity={setCurrentDocumento}
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
                        title="Rinomina File"
                        handler={() => setMode("list")}
                        backToList
                    />
                    FORM DI MODIFICA FILE
                    {/* <FormOperation
                        setMode={setMode}
                        operation={currentOperation as Operazione}
                    /> */}
                </IonContent>
            )}
        </div>
    );
};

export default DocumentiPage;
