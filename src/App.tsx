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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import AuthPage from "./pages/AuthPage/AuthPage";
import { useEffect } from "react";
import { login } from "./store/auth-slice";
import { Route, Switch } from "react-router-dom";
import Logout from "./components/logout/Logout";
import axios from "axios";
import PasswordPage from "./pages/PasswordPage/PasswordPage";

setupIonicReact();

const App: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.authToken);

    axios.interceptors.request.use(
        (config) => {
            config.headers!.authorization = token ? token : false;
            return config;
        },
        (error) => Promise.reject(error)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) dispatch(login(token));
    }, [dispatch]);

    return (
        <IonApp>
            <Header token={token} />
            {token && (
                <IonSplitPane contentId="main">
                    <Menu />
                    <IonRouterOutlet id="main"></IonRouterOutlet>
                </IonSplitPane>
            )}
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
                        <div>Appuntamenti</div>
                    </Route>
                )}
                {token && (
                    <Route path="/immobili">
                        <div>Immobili</div>
                    </Route>
                )}
                {token && (
                    <Route path="/persone">
                        <div>persone</div>
                    </Route>
                )}
                {token && (
                    <Route path="/lavori">
                        <div>lavori</div>
                    </Route>
                )}
                {token && (
                    <Route path="/operazioni">
                        <div>operazioni</div>
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
                <Route path="*">Not Found</Route>
            </Switch>
        </IonApp>
    );
};

export default App;
