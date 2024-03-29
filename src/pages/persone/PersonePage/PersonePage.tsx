import { peopleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import PersoneForm from "../../../components/forms/persone-form/PersoneForm";
import Selector from "../../../components/selector/Selector";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const PersonePage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const [mode, setMode] = useState<"list" | "form">("list");

    const backToList = () => {
        setMode("list");
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <NewEntityBar
                        setMode={setMode}
                        icon={peopleOutline}
                        title="Nuova Persona"
                    />

                    <Selector setMode={setMode} entitiesType="persone" />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title="Nuova Persona"
                        handler={backToList}
                        backToList
                    />

                    <PersoneForm persona={null} backToList={backToList} />
                </>
            )}
        </>
    );
};

export default PersonePage;
