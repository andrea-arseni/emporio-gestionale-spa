import {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    setupIonicReact,
} from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Header from "./components/header/Header";
import Menu from "./components/menu/Menu";
import { RootState } from "./store";
import AuthPage from "./pages/auth/AuthPage/AuthPage";
import { Redirect, Route, Switch } from "react-router-dom";
import Logout from "./components/logout/Logout";
import PasswordPage from "./pages/auth/PasswordPage/PasswordPage";
import AppuntamentiPage from "./pages/appuntamenti/AppuntamentiPage/AppuntamentiPage";
import ImmobiliPage from "./pages/immobili/ImmobiliPage/ImmobiliPage";
import OperazioniPage from "./pages/operazioni/OperazioniPage/OperazioniPage";
import LogsPage from "./pages/immobili/LogsPage/LogsPage";
import LavoriPage from "./pages/lavori/LavoriPage/LavoriPage";
import LavoriDataPage from "./pages/lavori/LavoriDataPage/LavoriDataPage";
import PersonaPage from "./pages/persone/PersonaPage/PersonaPage";
import EventsPage from "./pages/persone/EventsPage/EventsPage";
import DocumentiPage from "./pages/documenti/DocumentiPage/DocumentiPage";
import PersonaFilePage from "./pages/persone/PersonaFilePage/PersonaFilePage";
import ImmobiliFilesPage from "./pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";
import { useAppSelector } from "./hooks";
import ReportsPage from "./pages/documenti/ReportsPage/ReportsPage";

setupIonicReact();

const App: React.FC = () => {
    const token = useAppSelector((state: RootState) => state.auth.authToken);

    return (
        <IonApp>
            <Header token={token} />
            <IonSplitPane contentId="main">
                {token && <Menu />}
                <IonRouterOutlet id="main">
                    <Switch>
                        {!token && (
                            <Route path="/login">
                                <AuthPage />
                            </Route>
                        )}
                        {!token && (
                            <Route path="/primo-accesso">
                                <PasswordPage />
                            </Route>
                        )}
                        {!token && (
                            <Route path="/rinnova-password">
                                <PasswordPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/appuntamenti">
                                <AppuntamentiPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/immobili" exact>
                                <ImmobiliPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/immobili/:id/files" exact>
                                <ImmobiliFilesPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/immobili/:id/storia">
                                <LogsPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/persone" exact>
                                <PersonaPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/persone/:id" exact>
                                <EventsPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/persone/:id/files">
                                <PersonaFilePage />
                            </Route>
                        )}{" "}
                        {token && (
                            <Route path="/obiettivi" exact>
                                <LavoriPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/obiettivi/:id">
                                <LavoriDataPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/operazioni">
                                <OperazioniPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/documenti">
                                <DocumentiPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/reports">
                                <ReportsPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/logout">
                                <Logout />
                            </Route>
                        )}
                        <Route path="*">
                            <Redirect to={token ? "appuntamenti" : "login"} />
                        </Route>
                    </Switch>
                </IonRouterOutlet>
            </IonSplitPane>
        </IonApp>
    );
};

export default App;

/*

5 Novembre

- Funzione Conferma Visita 

- Change content of modal con messaggio editabile
- Share testing

- Lista Visita One Day
- Lista Visita con Items
- If persona also add contatto - pure in form
- Testing Generico

- Immobile Concluso
- Ripristina Immobile

PER OGGI OK

***
 
- ionic capacitor add ios
- ionic capacitor copy ios
- ionic capacitor run ios * is 2 step, is better
- npx cap run android

<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS"/>

// Initializes the Bridge
@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.registerPlugin(Contacts.class);
    }
*/
