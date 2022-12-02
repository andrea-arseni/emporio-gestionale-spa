import {
    IonApp,
    IonContent,
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
import AuthPage from "./pages/auth/AuthPage/AuthPage";
import { Navigate, Route, Routes } from "react-router-dom";
import PasswordPage from "./pages/auth/PasswordPage/PasswordPage";
import AppuntamentiPage from "./pages/appuntamenti/AppuntamentiPage/AppuntamentiPage";
import ImmobiliPage from "./pages/immobili/ImmobiliPage/ImmobiliPage";
import OperazioniPage from "./pages/operazioni/OperazioniPage/OperazioniPage";
import LavoriPage from "./pages/lavori/LavoriPage/LavoriPage";
import LavoriDataPage from "./pages/lavori/LavoriDataPage/LavoriDataPage";
import PersonaPage from "./pages/persone/PersonaPage/PersonaPage";
import DocumentiPage from "./pages/documenti/DocumentiPage/DocumentiPage";
import PersonaFilePage from "./pages/persone/PersonaFilePage/PersonaFilePage";
import ImmobiliFilesPage from "./pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";
import { useAppDispatch, useAppSelector } from "./hooks";
import ReportsPage from "./pages/documenti/ReportsPage/ReportsPage";
import { isUserAdmin } from "./utils/userUtils";
import { useEffect } from "react";
import { performAutoLogin } from "./store/auth-thunk";
import StoriaPage from "./pages/storia/StoriaPage";
import EmporioPage from "./pages/emporio/EmporioPage";
import ServiziPage from "./pages/servizi/ServiziPage";
import PublicImmobiliPage from "./pages/immobili/publicImmobiliPage/PublicImmobiliPage";
import ContattiPage from "./pages/contatti/ContattiPage";

setupIonicReact();

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(performAutoLogin());
    }, [dispatch]);

    const token = useAppSelector((state) => state.auth.authToken);

    const userData = useAppSelector((state) => state.auth.userData);

    return (
        <IonApp>
            <IonSplitPane contentId="main">
                <Menu />
                <IonContent id="main" color="light">
                    <Header token={token} />

                    <Routes>
                        {!token && (
                            <Route path="/login" element={<AuthPage />} />
                        )}
                        {!token && (
                            <Route
                                path="/primo-accesso"
                                element={<PasswordPage />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/rinnova-password"
                                element={<PasswordPage />}
                            />
                        )}
                        {!token && (
                            <Route path="/emporio" element={<EmporioPage />} />
                        )}
                        {!token && (
                            <Route
                                path="/i-nostri-servizi"
                                element={<ServiziPage />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/i-nostri-immobili"
                                element={<PublicImmobiliPage />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/contattaci"
                                element={<ContattiPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/appuntamenti"
                                element={<AppuntamentiPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili"
                                element={<ImmobiliPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:id/files"
                                element={<ImmobiliFilesPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:id/storia"
                                element={<StoriaPage type="immobile" />}
                            />
                        )}
                        {token && (
                            <Route path="/persone" element={<PersonaPage />} />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id"
                                element={<StoriaPage type="persona" />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id/files"
                                element={<PersonaFilePage />}
                            />
                        )}
                        {token && (
                            <Route path="/obiettivi" element={<LavoriPage />} />
                        )}
                        {token && (
                            <Route
                                path="/obiettivi/:id"
                                element={<LavoriDataPage />}
                            />
                        )}
                        {token && isUserAdmin(userData) && (
                            <Route
                                path="/operazioni"
                                element={<OperazioniPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/documenti"
                                element={<DocumentiPage />}
                            />
                        )}
                        {token && (
                            <Route path="/reports" element={<ReportsPage />} />
                        )}
                        <Route
                            path="/*"
                            element={
                                <Navigate
                                    to={token ? "/appuntamenti" : "/emporio"}
                                    replace
                                />
                            }
                        />
                    </Routes>
                </IonContent>
            </IonSplitPane>
        </IonApp>
    );
};

export default App;

/*

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
