import axios from "axios";
import {
    IonApp,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
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
import { useEffect } from "react";

import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: "eu-central-1",

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "eu-central-1_Gdqd6f47B",

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: "1pmqp2gpdgjshv36ejemsslonn",

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
            // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: "arsecasa.link",
            // OPTIONAL - Cookie path
            path: "/",
            // OPTIONAL - Cookie expiration in days
            expires: 365,
            // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            sameSite: "lax",
            // OPTIONAL - Cookie secure flag
            // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: false,
        },

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: "USER_PASSWORD_AUTH",

        // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: "https://emporiocaseloginsystem.auth.eu-central-1.amazoncognito.com",
            scope: [
                "phone",
                "email",
                "profile",
                "openid",
                "aws.cognito.signin.user.admin",
            ],
            redirectSignIn: "http://localhost:3000/",
            redirectSignOut: "http://localhost:3000/",
            responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
    },
});

// You can get the current config object
const currentConfig = Auth.configure();

setupIonicReact();

const App: React.FC = () => {
    useEffect(() => {
        // define async function
        async function startApp() {
            try {
                const user = await Auth.signIn(
                    "andrea.arseni87@gmail.com",
                    "Andrea2022!"
                );
                console.log(user);
            } catch (e) {
                console.log(e);
            }
            try {
                const res = await axios.get("https://arsecasa.link/ping");
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        }
        // invoke
        startApp();
    });

    return <IonApp></IonApp>;
};

export default App;

// 1. Fare una chiamata alla API path ping
// 2. If call ok si vola
// 3. If call 401 redirect login
