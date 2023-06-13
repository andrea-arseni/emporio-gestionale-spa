import { IonItem, IonLabel } from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { Evento } from "../../entities/evento.model";
import { getDateAndTime } from "../../utils/timeUtils";
import { useAppDispatch } from "../../hooks";
import useUpAndDown from "../../hooks/use-up-and-down";
import { setEvento } from "../../store/persona-slice";
import { useNavigate } from "react-router-dom";
import useNavigateToItem from "../../hooks/use-navigate-to-item";
import React from "react";

const ListEventi: React.FC<{
    eventi: Evento[];
    ref?: any;
}> = React.forwardRef((props, ref: any) => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setEvento(null));
    }, [dispatch]);

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.eventi, selected, defineSelected, ref);

    const selectItem = useCallback(
        (id: number) => {
            dispatch(setEvento(props.eventi.filter((el) => el.id === id)[0]));
            navigate(`${id.toString()}`);
        },
        [dispatch, navigate, props.eventi]
    );

    useNavigateToItem(selected, selectItem);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }

        dispatch(setEvento(props.eventi.filter((el) => el.id === id)[0]));
        navigate(`${id.toString()}`);
    };

    const getDescrizione = (evento: Evento) => {
        if (
            evento.descrizione &&
            evento.descrizione.indexOf("[") === 0 &&
            evento.descrizione.includes("]")
        ) {
            const primaParte = evento.descrizione
                .substring(1)
                .split("]")[0]
                .trim();
            const secondaParte = evento.descrizione.split("]")[1].trim();
            return (
                <>
                    <p style={{ color: "#3880ff" }}>
                        Status cambiato: {primaParte}
                    </p>
                    <h2>{secondaParte}</h2>
                </>
            );
        }
        return <h2>{evento.descrizione}</h2>;
    };

    return (
        <>
            {props.eventi.map((evento: Evento) => {
                return (
                    <IonItem
                        key={evento.id}
                        color={selected === evento.id ? "primary" : "light"}
                        onClick={() => handleClick(evento.id!)}
                    >
                        <IonLabel
                            text-wrap
                            color={selected === evento.id ? "light" : "dark"}
                        >
                            <p>{`${getDateAndTime(evento.data!)} ${
                                evento.user && evento.user.name
                                    ? `inserito da ${evento.user.name}`
                                    : ""
                            }`}</p>
                            {getDescrizione(evento)}
                            {evento.immobile && (
                                <>
                                    <p
                                        style={{
                                            color:
                                                selected !== evento.id
                                                    ? "var(--ion-color-primary)"
                                                    : undefined,
                                        }}
                                    >{`Interessato al Ref. ${evento.immobile.ref}: ${evento.immobile.titolo}`}</p>
                                    <p>{`${evento.immobile.indirizzo} (${evento.immobile.comune})`}</p>
                                </>
                            )}
                        </IonLabel>
                    </IonItem>
                );
            })}
        </>
    );
});

export default ListEventi;
