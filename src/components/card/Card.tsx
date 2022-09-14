import styles from "./Card.module.css";
import {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonIcon,
    IonText,
} from "@ionic/react";
import { phonePortraitOutline, mailOutline } from "ionicons/icons";
import useSize from "../../hooks/use-size";

const Card: React.FC<{
    subTitle: string;
    title: string;
    phone: string | null;
    email: string | null;
}> = (props) => {
    const [widthScreen] = useSize();

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>{props.subTitle}</IonCardSubtitle>
                <IonCardTitle>{props.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                {props.phone && (
                    <IonItem>
                        <IonIcon
                            className={styles.icon}
                            icon={phonePortraitOutline}
                        ></IonIcon>
                        <IonText>
                            {props.phone.includes("non presente") ? (
                                props.phone
                            ) : (
                                <a href={`tel:${props.phone}`}>{props.phone}</a>
                            )}
                        </IonText>
                    </IonItem>
                )}
                {props.email && (
                    <IonItem>
                        <IonIcon
                            className={styles.icon}
                            icon={mailOutline}
                        ></IonIcon>
                        <IonText>
                            {props.email.includes("non presente") ? (
                                props.email
                            ) : (
                                <a href={`mailto:${props.email}`}>
                                    {widthScreen <= 400 ? "Email" : props.email}
                                </a>
                            )}
                        </IonText>
                    </IonItem>
                )}
            </IonCardContent>
        </IonCard>
    );
};

export default Card;
