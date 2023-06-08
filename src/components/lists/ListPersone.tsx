import { IonItem, IonLabel, IonNote } from "@ionic/react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Entity } from "../../entities/entity";
import styles from "./Lists.module.css";
import { Persona } from "../../entities/persona.model";
import { getPersonaNameColor } from "../../utils/statusHandler";
import useWindowSize from "../../hooks/use-size";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { getDayName } from "../../utils/timeUtils";
import { setPersona } from "../../store/persona-slice";
import useUpAndDown from "../../hooks/use-up-and-down";

const ListPersone: React.FC<{
    persone: Persona[];
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
}> = (props) => {
    const navigate = useNavigate();

    const [width] = useWindowSize();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPersona(null));
    }, [dispatch]);

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.persone, selected, defineSelected);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }

        if (props.setCurrentEntity) {
            props.setCurrentEntity(
                props.persone.filter((el) => el.id === id)[0]
            );
            return;
        }

        dispatch(setPersona(props.persone.filter((el) => el.id === id)[0]));
        navigate(`/persone/${id.toString()}`);
    };

    const getTelefono = (persona: Persona) => {
        if (!persona.telefono) return <p>{"Telefono mancante"}</p>;
        return <p>{`Tel: ${persona.telefono}`}</p>;
    };

    const getEmail = (persona: Persona) => {
        if (!persona.email) return <p>{"Email mancante"}</p>;
        return <p>{`Email: ${persona.email}`}</p>;
    };

    const getData = (data: Date) => {
        return (
            <p>
                Ultimo contatto:{" "}
                {getDayName(data, width >= 450 ? "long" : "short")}
            </p>
        );
    };

    const getPersona = (persona: Persona) => {
        return (
            <IonItem
                key={persona.id}
                color={
                    selected === persona.id
                        ? "primary"
                        : getPersonaNameColor(persona.status!.toLowerCase())
                }
                onClick={() => handleClick(persona.id!)}
            >
                <IonLabel text-wrap>
                    <h2>{persona.nome} </h2>
                    {getTelefono(persona)}
                    {getEmail(persona)}
                    {getData(new Date(persona.data!))}
                </IonLabel>
                {width > 500 &&
                    (persona.ruolo ||
                        persona.immobili ||
                        persona.immobileInquilino) && (
                        <IonLabel>
                            {persona.ruolo && (
                                <p>{`Ruolo: ${persona.ruolo.toUpperCase()}`}</p>
                            )}
                            {persona.immobili && <p>{`Proprietario`}</p>}
                            {persona.immobileInquilino && <p>{`Inquilino`}</p>}
                        </IonLabel>
                    )}
                <IonNote
                    slot="end"
                    className={styles.note}
                    color={
                        selected === persona.id ||
                        persona.status === "E_EVITA" ||
                        persona.status === "D_DISATTIVA"
                            ? "light"
                            : undefined
                    }
                >
                    {persona.status!.toUpperCase().split("_")[1]}
                    <br />
                    {persona.provenienza &&
                        persona.provenienza.toUpperCase().replace("_", " ")}
                </IonNote>
            </IonItem>
        );
    };

    return <>{props.persone.map((persona: Persona) => getPersona(persona))}</>;
};

export default ListPersone;
