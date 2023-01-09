import { IonButton } from "@ionic/react";
import { peopleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import PersoneForm from "../../../components/forms/persone-form/PersoneForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Persona } from "../../../entities/persona.model";

const PersonaPage: React.FC<{ specific?: boolean }> = (props) => {
    const [mode, setMode] = useState<"list" | "form">("list");

    useEffect(() => {
        setMode("list");
    }, [props.specific]);

    const location = useLocation();
    const navigate = useNavigate();

    const [currentPersona, setCurrentPersona] = useState<Entity | null>(null);

    const backToList = () => {
        setMode("list");
        setCurrentPersona(null);
    };

    return (
        <>
            {props.specific && (
                <IonButton
                    onClick={() => navigate(-1)}
                    className="backButton"
                    size="small"
                    color="dark"
                >
                    Indietro
                </IonButton>
            )}
            {mode === "list" && (
                <>
                    <NewEntityBar
                        disabled={props.specific}
                        setMode={setMode}
                        icon={peopleOutline}
                        title="Nuova Persona"
                    />

                    <Selector
                        localQuery={props.specific}
                        specific={props.specific}
                        baseUrl={props.specific ? location.pathname : undefined}
                        setMode={setMode}
                        entitiesType="persone"
                        setCurrentEntity={setCurrentPersona}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentPersona?.id
                                ? "Modifica Persona"
                                : "Nuova Persona"
                        }
                        handler={backToList}
                        backToList
                    />

                    <PersoneForm
                        persona={currentPersona as Persona}
                        setCurrentPersona={setCurrentPersona}
                        backToList={backToList}
                    />
                </>
            )}
        </>
    );
};

export default PersonaPage;
