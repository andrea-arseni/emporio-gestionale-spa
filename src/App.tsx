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

STRONG IMPROVEMENTS GESTIONALE

- Descrizione non rossa - usa invece il messaggio sul bottone - VINTO
- Footer basso anche dopo che hai usato un filtro - VINTO
- Correzione altri form - VINTO
- Se una persona è interessata ad un immobile, al prossimo form automaticamente seleziona quell'immobile
- Immobili default già sorted per attivo e per prezzo
- Televisione sempre attiva
- Creazione file zip su backend da lista di immagini
- Call che restituisce il file zip
- Frontend che effettua la call per il download immagini
- Chat GPT test crea descrizione da dati
- Chat GPT test call API
- Test integrazione Caht GPT in gestionale
- Filtro persone prima per cose poi per status
*/

/*
- Filtro only in IOS
- Border of body
*/
