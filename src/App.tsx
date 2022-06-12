import { Redirect, Route } from "react-router-dom";
import axios from "axios";
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from "amazon-cognito-identity-js";

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
import { useEffect } from "react";

setupIonicReact();

let idToken: string = "";

const authenticationData = {
    Username: "andrea",
    Password: "Andrea2022!",
};
const authenticationDetails = new AuthenticationDetails(authenticationData);
const poolData = {
    UserPoolId: "eu-central-1_Gdqd6f47B",
    ClientId: "7dpqde9g9q9rao2cst7g9re6i6",
};
const userPool = new CognitoUserPool(poolData);
const userData = {
    Username: "andrea",
    Pool: userPool,
};
const cognitoUser = new CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        console.log(result);
        idToken = result.getIdToken().getJwtToken();
    },
    onFailure: function (err) {
        console.log(err.message || JSON.stringify(err));
    },
});

const App: React.FC = () => {
    useEffect(() => {
        const fetchRes = async () => {
            try {
                const url = `${process.env.REACT_APP_PROXY_URL!}/immobili`;
                console.log(url);
                console.log(idToken);
                const res = await axios.get(url, {
                    headers: {
                        Authorization: idToken,
                    },
                });
                console.log(res);
            } catch (e: any) {
                console.log(e);
            }
        };

        setTimeout(() => {
            fetchRes();
        }, 3000);
    }, []);

    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/tab1">
                            <Tab1 />
                        </Route>
                        <Route exact path="/tab2">
                            <Tab2 />
                        </Route>
                        <Route path="/tab3">
                            <Tab3 />
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/tab1" />
                        </Route>
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="tab1" href="/tab1">
                            <IonIcon icon={triangle} />
                            <IonLabel>Tab 1</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab2" href="/tab2">
                            <IonIcon icon={ellipse} />
                            <IonLabel>Tab 2</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab3" href="/tab3">
                            <IonIcon icon={square} />
                            <IonLabel>Tab 3</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
