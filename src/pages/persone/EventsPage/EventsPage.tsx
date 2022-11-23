import { personAddOutline } from "ionicons/icons";
import { useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import EventoForm from "../../../components/forms/evento-form/EventoForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Evento } from "../../../entities/evento.model";
import { Persona } from "../../../entities/persona.model";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useQueryData from "../../../hooks/use-query-data";
import { fetchPersonaById } from "../../../store/persona.thunk";

const EventsPage: React.FC<{ id: string }> = (props) => {
    const currentPersona = useAppSelector((state) => state.persona.persona);

    const dispatch = useAppDispatch();

    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentEvent, setCurrentEvent] = useState<Entity | null>(null);

    const queryData = useQueryData("eventi");

    const backToList = () => {
        setMode("list");
        setCurrentEvent(null);
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
                        setMode={setMode}
                        entitiesType="eventi"
                        setCurrentEntity={setCurrentEvent}
                        queryData={queryData}
                        baseUrl={`/persone/${currentPersona.id}/eventi`}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <div>
                        <FormTitle
                            title={
                                currentEvent?.id
                                    ? "Modifica Evento"
                                    : "Aggiorna Persona"
                            }
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
