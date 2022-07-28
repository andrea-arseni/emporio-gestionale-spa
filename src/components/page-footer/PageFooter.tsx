import {
    IonFooter,
    IonToolbar,
    IonButton,
    IonIcon,
    IonTitle,
} from "@ionic/react";
import { arrowBackOutline, arrowForwardOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";

const PageFooter: React.FC<{
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    numberOfResults: number;
}> = (props) => (
    <IonFooter>
        <IonToolbar mode="ios">
            {props.page > 1 && (
                <IonButton
                    slot="start"
                    fill="clear"
                    color="light"
                    onClick={() => props.setPage((page) => page - 1)}
                >
                    <IonIcon
                        color="dark"
                        slot="icon-only"
                        icon={arrowBackOutline}
                    ></IonIcon>
                </IonButton>
            )}
            <IonTitle>{`Pagina ${props.page} di ${Math.ceil(
                props.numberOfResults / 20
            )} ( ${props.numberOfResults} risultati )`}</IonTitle>
            {props.page < Math.ceil(props.numberOfResults / 20) && (
                <IonButton
                    slot="end"
                    fill="clear"
                    color="light"
                    onClick={() => props.setPage((page) => page + 1)}
                >
                    <IonIcon
                        color="dark"
                        slot="icon-only"
                        icon={arrowForwardOutline}
                    ></IonIcon>
                </IonButton>
            )}
        </IonToolbar>
    </IonFooter>
);

export default PageFooter;
