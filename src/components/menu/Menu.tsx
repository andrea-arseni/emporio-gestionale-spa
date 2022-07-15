import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
} from "@ionic/react";
import {
    calendarOutline,
    peopleOutline,
    homeOutline,
    constructOutline,
    cardOutline,
    documentsOutline,
    logOutOutline,
} from "ionicons/icons";
import { useLocation } from "react-router";
import style from "./Menu.module.css";

interface AppPage {
    url: string;
    icon: string;
    title: string;
}

const appPages: AppPage[] = [
    {
        title: "Appuntamenti",
        url: "/appuntamenti",
        icon: calendarOutline,
    },
    {
        title: "Immobili",
        url: "/immobili",
        icon: homeOutline,
    },
    {
        title: "Persone",
        url: "/persone",
        icon: peopleOutline,
    },
    {
        title: "Lavori",
        url: "/lavori",
        icon: constructOutline,
    },
    {
        title: "Operazioni",
        url: "/operazioni",
        icon: cardOutline,
    },
    {
        title: "Documenti",
        url: "/documenti",
        icon: documentsOutline,
    },
    {
        title: "Logout",
        url: "/logout",
        icon: logOutOutline,
    },
];

const Menu: React.FC<{}> = () => {
    const location = useLocation();

    return (
        <IonMenu contentId="main" className={style.menu}>
            <IonContent>
                <IonList id="inbox-list" className={style.list}>
                    {appPages.map((appPage, index) => {
                        return (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem
                                    color={
                                        location.pathname === appPage.url
                                            ? "primary"
                                            : ""
                                    }
                                    routerLink={appPage.url}
                                    routerDirection="none"
                                    lines="none"
                                    detail={false}
                                >
                                    <IonIcon
                                        slot="start"
                                        icon={appPage.icon}
                                        className={
                                            location.pathname === appPage.url
                                                ? "selected"
                                                : ""
                                        }
                                    />
                                    <IonLabel
                                        className={
                                            location.pathname === appPage.url
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        {appPage.title}
                                    </IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
