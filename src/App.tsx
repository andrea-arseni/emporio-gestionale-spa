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
import StepsPage from "./pages/lavori/StepsPage/StepsPage";
import PersonePage from "./pages/persone/PersonePage/PersonePage";
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
import ServiziPage from "./pages/servizi/Servizi";
import ContattiPage from "./pages/contatti/ContattiPage";
import { isNativeApp } from "./utils/contactUtils";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation";
import Servizio from "./pages/servizio/Servizio";
import Contattaci from "./pages/contattaci/Contattaci";
import Immobili from "./pages/immobili/Immobili/Immobili";
import Immobile from "./pages/immobili/Immobile/Immobile";
import Filtra from "./pages/immobili/FiltraPage/Filtra";
import LavoroPage from "./pages/lavori/LavoriPage/LavoroPage";
import LavoroFormPage from "./pages/lavori/LavoriPage/LavoroFormPage";
import PersonaPage from "./pages/persone/PersonePage/PersonaPage";
import PersonaFormPage from "./pages/persone/PersonePage/PersonaFormPage";
import ImmobilePage from "./pages/immobili/ImmobiliPage/ImmobilePage";
import ImmobileFormPage from "./pages/immobili/ImmobiliPage/ImmobileFormPage";
import Appuntamento from "./pages/appuntamenti/Appuntamento";
import AppuntamentoFormPage from "./pages/appuntamenti/AppuntamentoFormPage";
import EventPage from "./pages/persone/EventsPage/EventPage";
import StepPage from "./pages/lavori/StepsPage/StepPage";
import DocumentoPage from "./pages/documenti/DocumentoPage";
import DocumentoFormPage from "./pages/documenti/DocumentoFormPage";

setupIonicReact();

const App: React.FC = () => {
    if (isNativeApp)
        ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(performAutoLogin());
    }, [dispatch]);

    const token = useAppSelector((state) => state.auth.authToken);

    const userData = useAppSelector((state) => state.auth.userData);

    return (
        <IonApp>
            <IonSplitPane contentId="main">
                {(token || isNativeApp) && <Menu />}
                <IonContent
                    id="main"
                    color="light"
                    style={{ backgroundColor: "white !important" }}
                >
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
                                path="/i-nostri-servizi/:serviceName"
                                element={<Servizio />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/i-nostri-immobili"
                                element={<Immobili />}
                            />
                        )}
                        {!token && (
                            <Route path="/filtra" element={<Filtra />} />
                        )}
                        {!token && (
                            <Route
                                path="/i-nostri-immobili/:id"
                                element={<Immobile />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/contattaci"
                                element={<Contattaci />}
                            />
                        )}
                        {!token && (
                            <Route
                                path="/contatti"
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
                                path="/appuntamenti/:id"
                                element={<Appuntamento />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/appuntamenti/:id/modifica"
                                element={<AppuntamentoFormPage />}
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
                                path="/immobili/:id"
                                element={<ImmobilePage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:id/modifica"
                                element={<ImmobileFormPage />}
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
                                path="/immobili/:idImmobile/files/:id"
                                element={<DocumentoPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:idImmobile/files/:id/modifica"
                                element={<DocumentoFormPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:id/storia"
                                element={<StoriaPage type="immobile" />}
                            />
                        )}
                        {token && (
                            <Route path="/persone" element={<PersonePage />} />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id"
                                element={<PersonaPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id/modifica"
                                element={<PersonaFormPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id/storia"
                                element={<StoriaPage type="persona" />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id/storia/:idEvento"
                                element={<EventPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:id/files"
                                element={<PersonaFilePage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:idPersona/files/:id"
                                element={<DocumentoPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/persone/:idPersona/files/:id/modifica"
                                element={<DocumentoFormPage />}
                            />
                        )}
                        {token && (
                            <Route path="/obiettivi" element={<LavoriPage />} />
                        )}
                        {token && (
                            <Route
                                path="/obiettivi/:id"
                                element={<LavoroPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/obiettivi/:id/modifica"
                                element={<LavoroFormPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/obiettivi/:id/storia"
                                element={<StepsPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/obiettivi/:idLavoro/storia/:idStep"
                                element={<StepPage />}
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
                        {token && (
                            <Route
                                path="/documenti/:id"
                                element={<DocumentoPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/reports/:id"
                                element={<DocumentoPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/documenti/:id/modifica"
                                element={<DocumentoFormPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/reports/:id/modifica"
                                element={<DocumentoFormPage />}
                            />
                        )}
                        <Route
                            path="/*"
                            element={
                                <Navigate
                                    to={
                                        token
                                            ? "/appuntamenti"
                                            : isNativeApp
                                            ? "/emporio"
                                            : "/login"
                                    }
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

- NATIVEAPPS ONLINE

- WEBSITE

- Classe Energetica Maiuscola
- Spese Extra non previste
- Spese riscaldamento null
- Rendita

- OPTIMAL ARCHITECTURE

- Reserved EC2 1 years
- IAM Roles sul DB

- CURRICULUM AD ARIANNA
- LINKEDIN 

*/
