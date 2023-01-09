import { IonButton } from "@ionic/react";
import { homeOutline } from "ionicons/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import ImmobileForm from "../../../components/forms/immobile-form/ImmobileForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Immobile } from "../../../entities/immobile.model";

const ImmobiliPage: React.FC<{ specific?: boolean }> = (props) => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const backToList = () => {
        setMode("list");
        setCurrentImmobile(null);
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
                        icon={homeOutline}
                        title="Nuovo Immobile"
                    />
                    <Selector
                        localQuery={props.specific}
                        specific={props.specific}
                        baseUrl={props.specific ? location.pathname : undefined}
                        setMode={setMode}
                        entitiesType="immobili"
                        setCurrentEntity={setCurrentImmobile}
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
