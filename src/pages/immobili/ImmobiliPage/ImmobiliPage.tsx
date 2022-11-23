import { homeOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import ImmobileForm from "../../../components/forms/immobile-form/ImmobileForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";
import useQueryData from "../../../hooks/use-query-data";

const ImmobiliPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const queryData = useQueryData("immobili");

    const backToList = () => {
        setMode("list");
        setCurrentImmobile(null);
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <NewEntityBar
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
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentImmobile?.id
                                ? "Modifica Immobile"
                                : "Nuovo Immobile"
                        }
                        handler={backToList}
                        backToList
                    />
                    <ImmobileForm
                        immobile={
                            currentImmobile
                                ? (currentImmobile as Immobile)
                                : null
                        }
                        backToList={backToList}
                    />
                </>
            )}
        </>
    );
};

export default ImmobiliPage;
