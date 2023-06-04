import { IonItem, IonLabel, IonText } from "@ionic/react";
import { useState } from "react";
import useWindowSize from "../../hooks/use-size";
import styles from "./Lists.module.css";
import { Lavoro } from "../../entities/lavoro.model";
import { getLavoroTitleColor } from "../../utils/statusHandler";
import { useNavigate } from "react-router-dom";
import { getDayName } from "../../utils/timeUtils";
import { useAppDispatch } from "../../hooks";
import { setCurrentLavoro } from "../../store/lavori-slice";

const ListLavori: React.FC<{
    lavori: Lavoro[];
}> = (props) => {
    const navigate = useNavigate();

    const [width] = useWindowSize();

    const dispatch = useAppDispatch();

    const [selected, setSelected] = useState<number>(0);

    const handleClick = (id: number) => {
        if (selected === id) {
            dispatch(
                setCurrentLavoro(props.lavori.filter((el) => el.id === id)[0])
            );
            navigate(`/obiettivi/${id.toString()}`);
        } else {
            setSelected(id);
        }
    };

    const getData = (data: Date) => {
        return (
            <p>
                Ultimo aggiornamento:{" "}
                {getDayName(data, width >= 450 ? "long" : "short")}
            </p>
        );
    };

    return (
        <>
            {props.lavori.map((lavoro: Lavoro) => (
                <IonItem
                    key={lavoro.id!}
                    color={
                        lavoro.id === selected
                            ? "primary"
                            : getLavoroTitleColor(lavoro.status!)
                    }
                    onClick={() => handleClick(lavoro.id!)}
                >
                    <IonLabel text-wrap>
                        <h2>{lavoro.titolo} </h2>
                        {getData(new Date(lavoro.data!))}
                        {width < 600 && (
                            <IonText>{lavoro.status?.split("_")[1]}</IonText>
                        )}
                    </IonLabel>
                    {width >= 600 && (
                        <IonText
                            slot="end"
                            className={`${styles.note} ${styles.large}`}
                        >
                            {lavoro.status?.split("_")[1]}
                        </IonText>
                    )}
                </IonItem>
            ))}
        </>
    );
};

export default ListLavori;
