import { IonFooter, IonToolbar, IonButton, IonIcon } from "@ionic/react";
import { arrowBackOutline, arrowForwardOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import useWindowSize from "../../hooks/use-size";
import Title from "../title/Title";
import styles from "./PageFooter.module.css";

const PageFooter: React.FC<{
    page?: number;
    setPage?: Dispatch<SetStateAction<number>>;
    numberOfResults: number;
    simple?: boolean;
}> = (props) => {
    const [width] = useWindowSize();

    if (props.simple) {
        const text = `${props.numberOfResults} risultat${
            props.numberOfResults === 1 ? "o" : "i"
        } `;
        return (
            <IonFooter className={styles.footer}>
                <IonToolbar mode="ios" className={styles.toolbar}>
                    {props.numberOfResults > 0 && <Title>{text}</Title>}
                </IonToolbar>
            </IonFooter>
        );
    }

    const text = `Pagina ${props.page} di ${Math.ceil(
        props.numberOfResults / 20
    )} ( ${props.numberOfResults} risultat${
        props.numberOfResults === 1 ? "o" : "i"
    } )`;

    return (
        <IonFooter className={styles.footer}>
            <IonToolbar mode="ios" className={styles.toolbar}>
                {props.page! > 1 && (
                    <IonButton
                        slot="start"
                        fill="clear"
                        color="light"
                        onClick={() => props.setPage!((page) => page - 1)}
                    >
                        <IonIcon
                            size={width < 400 ? "small" : undefined}
                            color="dark"
                            slot="icon-only"
                            icon={arrowBackOutline}
                        ></IonIcon>
                    </IonButton>
                )}
                {props.numberOfResults > 0 && <Title>{text}</Title>}
                {props.page! < Math.ceil(props.numberOfResults / 20) && (
                    <IonButton
                        slot="end"
                        fill="clear"
                        color="light"
                        onClick={() => props.setPage!((page) => page + 1)}
                    >
                        <IonIcon
                            size={width < 400 ? "small" : undefined}
                            color="dark"
                            slot="icon-only"
                            icon={arrowForwardOutline}
                        ></IonIcon>
                    </IonButton>
                )}
            </IonToolbar>
        </IonFooter>
    );
};
export default PageFooter;
