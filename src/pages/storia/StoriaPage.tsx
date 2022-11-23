import { IonIcon, IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import { bookOutline, newspaperOutline, peopleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RiepilogoBar from "../../components/bars/riepilogo-bar/RiepilogoBar";
import StaticBar from "../../components/bars/static-bar/StaticBar";
import FormVisit from "../../components/forms/visit-form/VisitForm";
import Selector from "../../components/selector/Selector";
import { Immobile } from "../../entities/immobile.model";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useQueryData from "../../hooks/use-query-data";
import { backToList, refresh } from "../../store/appuntamenti-slice";
import { fetchImmobileById } from "../../store/immobile-thunk";
import { fetchPersonaById } from "../../store/persona.thunk";
import LogsPage from "../immobili/LogsPage/LogsPage";
import EventsPage from "../persone/EventsPage/EventsPage";

const StoriaPage: React.FC<{ type: "immobile" | "persona" }> = (props) => {
    const location = useLocation();

    const dispatch = useAppDispatch();

    const id = location.pathname.split("/")[2];

    const [mode, setMode] = useState<"eventi" | "visite">("eventi");

    const currentEntity = useAppSelector((state) =>
        props.type === "immobile"
            ? state.immobile.immobile
            : state.persona.persona
    );

    const queryData = useQueryData("visite");

    const isFormActive = useAppSelector(
        (state) => state.appuntamenti.isFormActive
    );

    const baseUrl = `/visite?${props.type}=${id}`;

    useEffect(() => {
        props.type === "persona"
            ? dispatch(fetchPersonaById(+id))
            : dispatch(fetchImmobileById(+id));
    }, [id, dispatch, props.type]);

    const getEventsContent = () =>
        props.type === "persona" ? (
            <EventsPage id={id} />
        ) : (
            <LogsPage id={id} />
        );

    const operationComplete = () => {
        dispatch(refresh());
        dispatch(backToList());
    };

    const getVisitContent = () => {
        return isFormActive ? (
            <FormVisit operationComplete={operationComplete} />
        ) : (
            <Selector
                queryData={queryData}
                entitiesType="visite"
                baseUrl={baseUrl}
            />
        );
    };

    const getRef = () => {
        const immobile = currentEntity as Immobile;
        return immobile ? immobile.ref : "";
    };

    const getIntestazione = () => (
        <>
            {currentEntity && props.type === "persona" && (
                <RiepilogoBar
                    currentEntity={currentEntity}
                    tipologia={props.type}
                />
            )}
            {props.type === "immobile" && (
                <StaticBar
                    icon={bookOutline}
                    title={`Storia dell'immobile ${getRef()}`}
                />
            )}
        </>
    );

    return (
        <>
            <>
                {getIntestazione()}
                {mode === "eventi" ? getEventsContent() : getVisitContent()}
            </>

            <IonSegment mode="ios" value={mode}>
                <IonSegmentButton
                    value="eventi"
                    onClick={() => setMode("eventi")}
                >
                    <IonIcon icon={newspaperOutline} />
                    <IonLabel>Eventi</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                    value="visite"
                    onClick={() => setMode("visite")}
                >
                    <IonIcon icon={peopleOutline} />
                    <IonLabel>Visite</IonLabel>
                </IonSegmentButton>
            </IonSegment>
        </>
    );
};

export default StoriaPage;
