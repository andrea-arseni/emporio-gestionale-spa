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
import { useSelector } from "react-redux";
import { RootState } from "./store";
import AuthPage from "./pages/AuthPage/AuthPage";
import { Redirect, Route, Switch } from "react-router-dom";
import Logout from "./components/logout/Logout";
import PasswordPage from "./pages/PasswordPage/PasswordPage";
import AppuntamentiPage from "./pages/AppuntamentiPage/AppuntamentiPage";
import ImmobiliPage from "./pages/ImmobiliPage/ImmobiliPage";
import OperazioniPage from "./pages/OperazioniPage/OperazioniPage";
import ImmobileDataPage from "./pages/ImmobileDataPage/ImmobileDataPage";
import LogsPage from "./pages/LogsPage/LogsPage";
import LavoriPage from "./pages/LavoriPage/LavoriPage";
import LavoriDataPage from "./pages/LavoriDataPage/LavoriDataPage";
import PersonaPage from "./pages/PersonaPage/PersonaPage";

setupIonicReact();

const App: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.authToken);

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
                            <Route path="/immobili/:id" exact>
                                <ImmobileDataPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/immobili/:id/storia">
                                <LogsPage />
                            </Route>
                        )}
                        {token && (
                            <Route path="/persone">
                                <PersonaPage />
                            </Route>
                        )}
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
                                <div>documenti</div>
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
- inizio pagina di apertura del contatto
- lista eventi con textwrap, data e ora
- itemOption modifica ed elimina
- form aggiungi evento con status persona immobile interesse e note
- modifica evento con solo note 
- elimina evento con avviso che non cambia status
- visita un immobile button
- link ai dati della persona in questione
 */
