import {
    IonHeader,
    IonToolbar,
    IonMenuButton,
    IonIcon,
    IonButtons,
    IonTitle,
} from "@ionic/react";
import { reorderFourOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";

const Header: React.FC<{ token: string | null }> = (props) => {
    const location = useLocation();

    const routes = props.token
        ? [
              "/appuntamenti",
              "/immobili",
              "/persone",
              "/obiettivi",
              "/operazioni",
              "/documenti",
          ]
        : ["/login", "/primo-accesso", "/rinnova-password"];

    const nome = routes.find((el) =>
        el.includes(location.pathname.split("/")[1].toLowerCase())
    )
        ? location.pathname.split("/")[1].toLowerCase().replace("-", " ")
        : "Gestionale Emporio Case";

    return (
        <IonHeader collapse="fade" translucent={true} color="light">
            <IonToolbar mode="ios">
                <IonButtons slot="start">
                    <IonMenuButton>
                        <IonIcon
                            color="dark"
                            slot="icon-only"
                            icon={reorderFourOutline}
                        ></IonIcon>
                    </IonMenuButton>
                </IonButtons>

                <IonTitle>
                    {nome.charAt(0).toUpperCase() + nome.substring(1)}
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
