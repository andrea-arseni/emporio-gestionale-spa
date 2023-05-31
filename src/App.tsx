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
import ServiziPage from "./pages/servizi/Servizi";
import ContattiPage from "./pages/contatti/ContattiPage";
import { isNativeApp } from "./utils/contactUtils";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation";
import Servizio from "./pages/servizio/Servizio";
import Contattaci from "./pages/contattaci/Contattaci";
import Immobili from "./pages/immobili/Immobili/Immobili";
import Immobile from "./pages/immobili/Immobile/Immobile";
import Filtra from "./pages/immobili/FiltraPage/Filtra";

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
                                path="/immobili"
                                element={<ImmobiliPage />}
                            />
                        )}
                        {token && (
                            <Route
                                path="/immobili/:id"
                                element={<ImmobiliPage specific />}
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
                                element={<PersonaPage specific />}
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

- Ogni volta che chiudi un form chiudi ogni possibile select - VINTO
- applica un release focus serio - VINTO
- 3 tentativi e sei fuori - VINTO
- Quando sei con il focus su descrizione immobile non considerare il doppio click - VINTO
- Quando scade il token non fare "Errore nella lettura del token" fai la logout - VINTO

IMPROVEMENTS 31/5/2023

- Se elimini il dove da un appuntamento deve mostrare l'indirizzo dell'immobile
- Non si vedono immobili aprendo da persona
- Così rimuove le proprietà da solo

*****

- Retrieve foto firmate oppure foto originali
- Navigazione su singolo immobile rivista
- Navigazione su singola persona rivista
- Disattiva button su persona
- Note private su Immobile
- Se trovi una persona già esistente e la vai a visitare proprietario inesistente e 1970 primo contatto è falso
- Cookie on little images 
- Parenti

- Deploy ed enjoy nuova versione

- WEBSITE

- Classe Eenergetica Maiuscola
- Spese Extra non previste
- Rendita

- NATIVEAPPS ONLINE

- OPTIMAL ARCHITECTURE

- Reserved EC2 1 years
- IAM Roles sul DB
- Cloudfront Price Class 100

- CURRICULUM AD ARIANNA
- LINKEDIN 

*/
