import { IonItem, IonLabel, IonNote } from "@ionic/react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import useWindowSize from "../../hooks/use-size";
import { numberAsPrice } from "../../utils/numberUtils";
import styles from "./Lists.module.css";
import ImmobileThumbnail from "../immobile-thumbnail/ImmobileThumbnail";
import FileSpecialiList from "../file-speciali-list/FileSpecialiList";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { setImmobile } from "../../store/immobile-slice";
import useUpAndDown from "../../hooks/use-up-and-down";
import useNavigateToItem from "../../hooks/use-navigate-to-item";
import React from "react";

const ListImmobili: React.FC<{
    immobili: Immobile[];
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    ref?: any;
}> = React.forwardRef((props, ref: any) => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [width] = useWindowSize();

    useEffect(() => {
        dispatch(setImmobile(null));
    }, [dispatch]);

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.immobili, selected, defineSelected, ref);

    const selectItem = useCallback(
        (id: number) => {
            dispatch(
                setImmobile(props.immobili.filter((el) => el.id === id)[0])
            );
            navigate(`/immobili/${id.toString()}`);
        },
        [dispatch, navigate, props.immobili]
    );

    useNavigateToItem(selected, selectItem);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }

        if (props.setCurrentEntity) {
            props.setCurrentEntity(
                props.immobili.filter((el) => el.id === id)[0]
            );
            return;
        }

        dispatch(setImmobile(props.immobili.filter((el) => el.id === id)[0]));
        navigate(`${id.toString()}`);
    };

    const getImmobile = (immobile: Immobile) => {
        return (
            <IonItem
                key={immobile.id}
                onClick={() => handleClick(immobile.id!)}
                color={selected === immobile.id ? "primary" : undefined}
            >
                <ImmobileThumbnail immobile={immobile} />
                <IonLabel
                    text-wrap
                    className={`${styles.label} ${
                        selected === immobile.id ? styles.selected : null
                    }`}
                    color={selected === immobile.id ? "white" : undefined}
                >
                    <h3
                        style={{
                            color:
                                selected === immobile.id
                                    ? "white"
                                    : immobile.status?.toLowerCase() ===
                                      "attivo"
                                    ? "#018937"
                                    : "#a40318",
                        }}
                    >
                        Riferimento {immobile.ref}
                    </h3>
                    <h2>{immobile.titolo} </h2>
                    <p>{`${immobile.indirizzo} (${immobile.comune})`}</p>
                    <p>
                        <span
                            style={{
                                color:
                                    selected !== immobile.id
                                        ? "#4C8CFF"
                                        : undefined,
                                marginRight: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            {numberAsPrice(immobile.prezzo!)}
                        </span>
                        {immobile.superficie} mq
                    </p>
                </IonLabel>
                {width >= 750 && (
                    <IonNote
                        slot="end"
                        className={`${styles.note} ${
                            selected === immobile.id ? styles.selected : null
                        }`}
                    >
                        <FileSpecialiList id={immobile.id!} />
                    </IonNote>
                )}
                {width >= 600 && (
                    <IonNote
                        slot="end"
                        className={`${styles.note} ${
                            selected === immobile.id ? styles.selected : null
                        }`}
                    >
                        {immobile.contratto?.toUpperCase()}
                        <br />
                        {immobile.categoria?.toUpperCase()}
                    </IonNote>
                )}
            </IonItem>
        );
    };

    return (
        <>{props.immobili.map((immobile: Immobile) => getImmobile(immobile))}</>
    );
});

export default ListImmobili;
