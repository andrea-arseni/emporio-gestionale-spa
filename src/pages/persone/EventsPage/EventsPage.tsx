import { personAddOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import EventoForm from "../../../components/forms/evento-form/EventoForm";
import Selector from "../../../components/selector/Selector";
import { Evento } from "../../../entities/evento.model";
import { Persona } from "../../../entities/persona.model";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchPersonaById } from "../../../store/persona.thunk";
import { setEvento } from "../../../store/persona-slice";

const EventsPage: React.FC<{ id: string }> = (props) => {
    const currentPersona = useAppSelector((state) => state.persona.persona);

    const currentEvent = useAppSelector((state) => state.persona.evento);

    const dispatch = useAppDispatch();

    const [mode, setMode] = useState<"list" | "form">("list");

    const backToList = () => {
        setMode("list");
        dispatch(setEvento(null));
        dispatch(fetchPersonaById(+props.id));
    };

    return (
        <>
            {mode === "list" && currentPersona && (
                <>
                    <NewEntityBar
                        setMode={setMode}
                        icon={personAddOutline}
                        title="Aggiorna Persona"
                    />

                    <Selector
                        localQuery
                        setMode={setMode}
                        entitiesType="eventi"
                        baseUrl={`/persone/${currentPersona.id}/eventi`}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <div>
                        <FormTitle
                            title={"Aggiorna Persona"}
                            handler={backToList}
                            backToList
                        />
                    </div>
                    <div>
                        {currentPersona && (
                            <EventoForm
                                persona={currentPersona as Persona}
                                evento={currentEvent as Evento}
                                backToList={backToList}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default EventsPage;
