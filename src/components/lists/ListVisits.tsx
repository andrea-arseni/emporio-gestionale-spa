import { IonItem, IonLabel, IonList } from "@ionic/react";
import { Persona } from "../../entities/persona.model";
import { Visit } from "../../entities/visit.model";
import { useAppDispatch } from "../../hooks";
import useList from "../../hooks/use-list";
import { capitalize } from "../../utils/stringUtils";
import Card from "../card/Card";
import styles from "./Lists.module.css";
import { getDayName } from "../../utils/timeUtils";
import { useCallback, useState } from "react";
import { setCurrentVisit } from "../../store/appuntamenti-slice";
import { useNavigate } from "react-router-dom";
import useUpAndDown from "../../hooks/use-up-and-down";
import useNavigateToItem from "../../hooks/use-navigate-to-item";

const ListVisits: React.FC<{
    visits: Visit[];
    displayDay?: boolean;
    filter?: string;
    deleteEntity?: (type: string, id: string, message?: string) => void;
}> = (props) => {
    const { list } = useList();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.visits, selected, defineSelected, list);

    const selectItem = useCallback(
        (id: number) => {
            dispatch(
                setCurrentVisit(props.visits.filter((el) => el.id === id)[0])
            );
            navigate(`/appuntamenti/${id.toString()}`);
        },
        [dispatch, navigate, props.visits]
    );

    useNavigateToItem(selected, selectItem);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }

        dispatch(setCurrentVisit(props.visits.filter((el) => el.id === id)[0]));
        navigate(`/appuntamenti/${id.toString()}`);
    };

    const getLuogo = (visit: Visit) =>
        visit.dove
            ? visit.dove
            : visit.immobile
            ? `${visit.immobile.indirizzo} (${visit.immobile.comune})`
            : "";

    const getPersonaContatto = (persona: Persona, isSelected: boolean) => {
        return (
            <p>
                {persona.telefono ? (
                    <a
                        style={{ color: isSelected ? "white" : undefined }}
                        href={`tel:${persona.telefono}`}
                    >
                        {persona.telefono}
                    </a>
                ) : (
                    "Telefono mancante"
                )}
            </p>
        );
    };

    const getVisitItem = (visit: Visit) => {
        return (
            <IonItem
                key={visit.id}
                onClick={() => handleClick(visit.id!)}
                color={selected === visit.id ? "primary" : "light"}
            >
                <IonLabel
                    text-wrap
                    color={selected === visit.id ? "light" : "dark"}
                >
                    {(props.displayDay || props.filter) && (
                        <h3>{getDayName(new Date(visit.quando!), "long")}</h3>
                    )}
                    <h3>{`Ore ${visit.quando?.split("T")[1].substring(0, 5)} ${
                        visit.user ? ` - ${capitalize(visit.user!.name!)}` : ""
                    }`}</h3>
                    <h2>
                        {`${
                            visit.persona ? capitalize(visit.persona.nome!) : ""
                        }${
                            visit.immobile
                                ? ` visita ref. ${visit.immobile.ref}`
                                : ""
                        }`}
                    </h2>
                    {visit.persona &&
                        getPersonaContatto(
                            visit.persona,
                            selected === visit.id
                        )}
                    {visit.note && <p>{visit.note}</p>}
                    {visit.dove && <p>{getLuogo(visit)}</p>}
                    {!visit.persona && <br />}
                    {!visit.note && <br />}
                </IonLabel>
            </IonItem>
        );
    };

    if (props.visits.length === 0) {
        return (
            <div className={`centered`} style={{ height: "200px" }}>
                <Card
                    subTitle={`Non sono presenti visite`}
                    title={`Non sono state trovate visite ${
                        props.filter
                            ? `con "${props.filter}" nel testo`
                            : "per questo giorno"
                    }`}
                />
            </div>
        );
    }

    return (
        <IonList
            ref={list}
            className={`${styles.list} ${
                !props.displayDay ? styles.listVisit : ""
            } ${props.filter ? styles.filteredListVisit : ""}`}
        >
            {props.visits.map((visit) => getVisitItem(visit))}
        </IonList>
    );
};

export default ListVisits;
