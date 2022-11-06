import { IonIcon } from "@ionic/react";
import { peopleOutline } from "ionicons/icons";
import { memo } from "react";
import { Visit } from "../../../entities/visit.model";
import { useAppDispatch } from "../../../hooks";
import { setCurrentVisit } from "../../../store/appuntamenti-slice";
import { setModalOpened } from "../../../store/ui-slice";
import styles from "./VisitItem.module.css";

const VisitItem: React.FC<{ visita: Visit }> = (props) => {
    const dispatch = useAppDispatch();

    const selezionaVisita = () => {
        dispatch(setCurrentVisit(props.visita));
        dispatch(setModalOpened(true));
    };

    return (
        <>
            <div
                key={props.visita.id! + Math.random() * 1000}
                onClick={selezionaVisita}
                className={`${styles.app} ${styles.meeting}`}
            >
                <IonIcon icon={peopleOutline} />
            </div>
        </>
    );
};

export default memo(VisitItem);
