import { IonContent, IonLoading, useIonAlert } from "@ionic/react";
import { personAddOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import RiepilogoBar from "../../../components/bars/riepilogo-bar/RiepilogoBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import EventoForm from "../../../components/forms/evento-form/EventoForm";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Evento } from "../../../entities/evento.model";
import { Persona } from "../../../entities/persona.model";
import { useAppDispatch } from "../../../hooks";
import useQueryData from "../../../hooks/use-query-data";
import { setPersona } from "../../../store/persona-slice";
import axiosInstance from "../../../utils/axiosInstance";
import errorHandler from "../../../utils/errorHandler";

const EventsPage: React.FC<{}> = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];

    const dispatch = useAppDispatch();

    const history = useHistory();

    const [showLoading, setShowLoading] = useState<boolean>(true);

    const [mode, setMode] = useState<"list" | "form">("list");

    const [presentAlert] = useIonAlert();

    const [currentPersona, setCurrentPersona] = useState<Entity | null>(null);

    const [currentEvent, setCurrentEvent] = useState<Entity | null>(null);

    const [update, triggerUpdate] = useState<number>(0);

    const queryData = useQueryData("eventi");

    const backToList = () => {
        setMode("list");
        setCurrentEvent(null);
        triggerUpdate((prevState) => ++prevState);
    };

    useEffect(() => {
        const fetchPersona = async () => {
            try {
                const res = await axiosInstance.get(`/persone/${id}`);
                setCurrentPersona(res.data);
                dispatch(setPersona(res.data));
                setShowLoading(false);
            } catch (e) {
                errorHandler(
                    e,
                    () => history.goBack(),
                    "Persona impossibile da aprire",
                    presentAlert
                );
            }
        };

        fetchPersona();
    }, [id, presentAlert, history, update, dispatch]);

    return (
        <div className="page">
            {mode === "list" && currentPersona && (
                <IonContent>
                    <IonLoading cssClass="loader" isOpen={showLoading} />
                    <RiepilogoBar
                        currentEntity={currentPersona}
                        tipologia={"persona"}
                    />
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
                </IonContent>
            )}
            {mode === "form" && (
                <IonContent>
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
                </IonContent>
            )}
        </div>
    );
};

export default EventsPage;
