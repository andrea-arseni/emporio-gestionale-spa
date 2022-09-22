import { IonToolbar, IonIcon, IonLabel } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import Title from "../../title/Title";

const StaticBar: React.FC<{
    icon: string;
    title: string;
}> = (props) => {
    const history = useHistory();

    return (
        <IonToolbar mode="ios">
            <IonIcon
                slot="start"
                icon={arrowBackOutline}
                className="arrowBack"
                onClick={() => history.goBack()}
            />
            <Title>
                <IonIcon
                    icon={props.icon}
                    style={{ position: "relative", top: "4px" }}
                />
                <IonLabel style={{ paddingLeft: "16px" }}>
                    {props.title}
                </IonLabel>
            </Title>
        </IonToolbar>
    );
};

export default StaticBar;
