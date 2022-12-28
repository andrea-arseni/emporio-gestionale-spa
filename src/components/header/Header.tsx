import {
    IonHeader,
    IonToolbar,
    IonMenuButton,
    IonIcon,
    IonButtons,
    IonTitle,
} from "@ionic/react";
import { closeOutline, reorderFourOutline } from "ionicons/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../../utils/stringUtils";
import styles from "./Header.module.css";

const Header: React.FC<{ token: string | null }> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const routes = props.token
        ? [
              "/appuntamenti",
              "/immobili",
              "/persone",
              "/obiettivi",
              "/operazioni",
              "/documenti",
          ]
        : [
              "/login",
              "/primo-accesso",
              "/rinnova-password",
              "/i-nostri-servizi",
              "/i-nostri-immobili",
              "/contatti",
              "/contattaci",
          ];

    const nome = routes.find((el) =>
        el.includes(location.pathname.split("/")[1].toLowerCase())
    )
        ? location.pathname
              .split("/")[1]
              .toLowerCase()
              .split("-")
              .map((el) => capitalize(el))
              .join(" ")
        : "Emporio Case";

    const isSpecificPage = () => {
        const urlPieces = location.pathname.split("/");
        const name = urlPieces[1].toLowerCase();
        return (
            urlPieces.length === 3 &&
            (name === "i-nostri-immobili" || name === "i-nostri-servizi")
        );
    };

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

                {isSpecificPage() && (
                    <IonButtons slot="end" className={styles.close}>
                        <IonIcon
                            onClick={() => navigate(-1)}
                            color="dark"
                            slot="icon-only"
                            icon={closeOutline}
                        ></IonIcon>
                    </IonButtons>
                )}
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
