import {
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { Entity } from "../../../entities/entity";
import { Lavoro } from "../../../entities/lavoro.model";
import { Persona } from "../../../entities/persona.model";
import {
    getLavoroTitleColor,
    getPersonaNameColor,
} from "../../../utils/statusHandler";
import styles from "./RiepilogoBar.module.css";

const RiepilogoBar: React.FC<{
    currentEntity: Entity;
    tipologia: "persona" | "lavoro";
}> = (props) => {
    const history = useHistory();

    const getTitle = () => {
        if (props.tipologia === "persona") {
            const persona = props.currentEntity as Persona;
            return persona.nome;
        } else {
            const lavoro = props.currentEntity as Lavoro;
            return lavoro.titolo;
        }
    };

    const getColor = () => {
        return props.tipologia === "lavoro"
            ? getLavoroTitleColor(entity!.status!)
            : getPersonaNameColor(entity!.status!);
    };

    const entity =
        props.tipologia === "persona"
            ? (props.currentEntity as Persona)
            : (props.currentEntity as Lavoro);

    return (
        <IonToolbar mode="ios" className={styles.toolbar} color={getColor()}>
            <IonButtons slot="start">
                <IonButton onClick={() => history.goBack()}>
                    <IonIcon slot="icon-only" icon={arrowBackOutline} />
                </IonButton>
            </IonButtons>
            <IonTitle size="small" className={styles.smallTitle}>
                {entity!.status?.replace("_", " ")}
            </IonTitle>
            <IonTitle className={styles.title}>{getTitle()}</IonTitle>
        </IonToolbar>
    );
};

export default RiepilogoBar;
