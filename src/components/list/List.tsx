import styles from "./List.module.css";
import {
    IonButton,
    IonContent,
    IonIcon,
    IonLabel,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import { entitiesType, Entity } from "../../entities/entity";
import Selector from "../selector/Selector";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";

const List: React.FC<{
    setMode?: Dispatch<SetStateAction<"form" | "list">>;
    setCurrentEntity?: Dispatch<SetStateAction<Entity | null>>;
    entitiesType: entitiesType;
    icon: string;
    title: string;
    static?: boolean;
    baseUrl?: string;
}> = (props) => {
    const history = useHistory();

    return (
        <IonContent>
            {!props.static && (
                <IonButton
                    expand="full"
                    mode="ios"
                    fill="solid"
                    style={{ margin: 0 }}
                    onClick={() =>
                        props.setMode ? props.setMode("form") : null
                    }
                >
                    <IonIcon icon={props.icon} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        {props.title}
                    </IonLabel>
                </IonButton>
            )}
            {props.static && (
                <IonToolbar mode="ios">
                    <IonIcon
                        icon={arrowBackOutline}
                        className="arrowBack"
                        onClick={() => history.goBack()}
                    />
                    <IonTitle>
                        <IonIcon icon={props.icon} className={styles.icon} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            {props.title}
                        </IonLabel>
                    </IonTitle>
                </IonToolbar>
            )}
            <Selector
                static={props.static ? props.static : undefined}
                setMode={props.setMode}
                entitiesType={props.entitiesType}
                setCurrentEntity={props.setCurrentEntity}
                baseUrl={props.baseUrl ? props.baseUrl : undefined}
            />
        </IonContent>
    );
};

export default List;
