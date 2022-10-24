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
import { Immobile } from "../../../entities/immobile.model";
import { Lavoro } from "../../../entities/lavoro.model";
import { Persona } from "../../../entities/persona.model";
import {
    getLavoroTitleColor,
    getPersonaNameColor,
} from "../../../utils/statusHandler";
import styles from "./RiepilogoBar.module.css";

const RiepilogoBar: React.FC<{
    currentEntity: Entity;
    tipologia: "persona" | "lavoro" | "immobile";
}> = (props) => {
    const history = useHistory();

    const getTitle = () => {
        if (props.tipologia === "persona") {
            const persona = props.currentEntity as Persona;
            return persona.nome;
        } else if (props.tipologia === "lavoro") {
            const entity = props.currentEntity as Lavoro;
            return entity.titolo;
        } else {
            const entity = props.currentEntity as Immobile;
            return `Ref. ${entity.ref} - ${entity.titolo}`;
        }
    };

    const getColor = () => {
        if (props.tipologia === "immobile") return undefined;
        return props.tipologia === "lavoro"
            ? getLavoroTitleColor(entity!.status!)
            : getPersonaNameColor(entity!.status!);
    };

    const entity =
        props.tipologia === "persona"
            ? (props.currentEntity as Persona)
            : (props.currentEntity as Lavoro | Immobile);

    return (
        <IonToolbar mode="ios" className={styles.toolbar} color={getColor()}>
            <IonButtons slot="start">
                <IonButton onClick={() => history.goBack()}>
                    <IonIcon slot="icon-only" icon={arrowBackOutline} />
                </IonButton>
            </IonButtons>
            {props.tipologia !== "immobile" && (
                <IonTitle size="small" className={styles.smallTitle}>
                    {entity!.status?.replace("_", " ")}
                </IonTitle>
            )}
            <IonTitle
                className={
                    props.tipologia !== "immobile" ? styles.title : undefined
                }
            >
                {getTitle()}
            </IonTitle>
        </IonToolbar>
    );
};

export default RiepilogoBar;
