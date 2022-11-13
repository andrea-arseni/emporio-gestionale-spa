import {
    IonContent,
    IonIcon,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
} from "@ionic/react";
import {
    calendarOutline,
    peopleOutline,
    homeOutline,
    cardOutline,
    documentsOutline,
    logOutOutline,
    golfOutline,
    podiumOutline,
} from "ionicons/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { performLogout } from "../../store/auth-thunk";
import { isUserAdmin } from "../../utils/userUtils";
import style from "./Menu.module.css";

interface AppPage {
    url: string;
    icon: string;
    title: string;
}

const Menu: React.FC<{}> = () => {
    const dispatch = useAppDispatch();

    const userData = useAppSelector((state) => state.auth.userData);

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
            title: "Obiettivi",
            url: "/obiettivi",
            icon: golfOutline,
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
            title: "Report",
            url: "/reports",
            icon: podiumOutline,
        },
    ];

    const location = useLocation();

    if (!isUserAdmin(userData)) {
        const indexOperazioni = appPages.findIndex(
            (el) => el.title === "Operazioni"
        );
        appPages.splice(indexOperazioni, 1);
    }

    return (
        <IonMenu contentId="main" className={style.menu}>
            <IonContent>
                <IonList id="inbox-list" className={style.list}>
                    {appPages.map((appPage, index) => {
                        return (
                            <IonMenuToggle
                                autoHide={false}
                                key={index}
                                className={`${style.itemWrapper} centered`}
                            >
                                <div
                                    className={`${style.itemWrapper} centered`}
                                >
                                    <NavLink
                                        to={appPage.url}
                                        className={({ isActive }) =>
                                            isActive
                                                ? `${style.link} centered ${style.active}`
                                                : `${style.link} centered ${style.inactive}`
                                        }
                                    >
                                        <IonIcon
                                            slot="start"
                                            icon={appPage.icon}
                                            className={
                                                location.pathname ===
                                                appPage.url
                                                    ? "selected"
                                                    : ""
                                            }
                                        />
                                        <IonLabel
                                            className={
                                                location.pathname ===
                                                appPage.url
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            {appPage.title}
                                        </IonLabel>
                                    </NavLink>
                                </div>
                            </IonMenuToggle>
                        );
                    })}
                    <IonMenuToggle className={`${style.itemWrapper} centered`}>
                        <div className={`${style.itemWrapper} centered`}>
                            <div
                                className={`${style.link} centered ${style.inactive}`}
                                onClick={() => dispatch(performLogout())}
                            >
                                <IonIcon slot="start" icon={logOutOutline} />
                                <IonLabel>LOGOUT</IonLabel>
                            </div>
                        </div>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
