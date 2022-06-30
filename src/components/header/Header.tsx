import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonMenuButton,
    IonIcon,
    IonButtons,
} from "@ionic/react";
import { reorderFourOutline } from "ionicons/icons";
import { useLocation } from "react-router";

const Header: React.FC<{}> = () => {
    const location = useLocation();

    const nome =
        location.pathname === "/"
            ? "Gestionale Emporio Case"
            : location.pathname.split("/")[1].toLowerCase();

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
