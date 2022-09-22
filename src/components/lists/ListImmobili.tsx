import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonText,
    useIonAlert,
} from "@ionic/react";
import {
    copyOutline,
    createOutline,
    newspaperOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import { Immobile } from "../../entities/immobile.model";
import useWindowSize from "../../hooks/use-size";
import axiosInstance from "../../utils/axiosInstance";
import errorHandler from "../../utils/errorHandler";
import { numberAsPrice } from "../../utils/numberAsPrice";
import styles from "./Lists.module.css";
import { useHistory } from "react-router";
import useSelection from "../../hooks/use-selection";

const ListImmobili: React.FC<{
    immobili: Immobile[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
    closeItems: () => void;
    selectMode: boolean;
}> = (props) => {
    const history = useHistory();

    const [width] = useWindowSize();

    const [presentAlert] = useIonAlert();

    const goToData = (id: number) => {
        history.push(`/immobili/${id.toString()}`);
    };

    const copyImmobile = async (id: number) => {
        // loader
        props.setShowLoading(true);
        // axios call
        try {
            const res = await axiosInstance.post(`/immobili/${id}/duplicate`);
            props.setShowLoading(false);
            // alert with go to new immobile or go to list
            presentAlert({
                header: "Ottimo",
                subHeader: `Immobile duplicato con successo!`,
                message: `Riferimento nuovo immobile: ${res.data.ref}`,
                buttons: [
                    {
                        text: "Vai al nuovo immobile",
                        handler: () => {
                            props.setCurrentEntity(res.data as Immobile);
                            props.setMode("form");
                        },
                    },
                    {
                        text: "Torna alla lista",
                        handler: () => {
                            props.closeItems();
                            props.setUpdate((prevValue) => ++prevValue);
                        },
                    },
                ],
            });
            // catch error
        } catch (e) {
            props.setShowLoading(false);
            errorHandler(
                e,
                () => {},
                "Duplicazione dell'immobile non riuscita",
                presentAlert
            );
        }
    };

    const { selectEntity, entitySelected } = useSelection(
        props.setCurrentEntity
    );

    const getImmobile = (immobile: Immobile) => {
        return (
            <IonItem
                key={immobile.id}
                detail={!props.selectMode}
                onClick={() =>
                    props.selectMode ? selectEntity(immobile) : null
                }
                color={entitySelected === immobile.id ? "secondary" : undefined}
            >
                <h3
                    className={`${styles.ref} ${
                        immobile.status?.toLowerCase() === "attivo"
                            ? styles.active
                            : styles.inactive
                    }`}
                >
                    {immobile.ref}
                </h3>
                <IonLabel text-wrap>
                    <h2>{immobile.titolo} </h2>
                    <p>{`${immobile.indirizzo} (${immobile.comune})`}</p>
                    <p>
                        <span
                            style={{
                                color: "#4C8CFF",
                                marginRight: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            {numberAsPrice(immobile.prezzo!)}
                        </span>
                        {immobile.superficie} mq
                    </p>
                </IonLabel>
                {width >= 600 && (
                    <IonNote slot="end" className={styles.note}>
                        {immobile.contratto?.toUpperCase()}
                        <br />
                        {immobile.categoria?.toUpperCase()}
                    </IonNote>
                )}
            </IonItem>
        );
    };

    if (props.selectMode)
        return <>{props.immobili.map((el) => getImmobile(el))}</>;

    return (
        <>
            {props.immobili.map((immobile: Immobile) => (
                <IonItemSliding key={immobile.id!} id={immobile.id?.toString()}>
                    {getImmobile(immobile)}
                    <IonItemOptions side="end">
                        <IonItemOption color="success">
                            <div
                                className="itemOption"
                                onClick={() => goToData(immobile.id!)}
                            >
                                <IonIcon icon={newspaperOutline} size="large" />
                                <IonText>Dati</IonText>
                            </div>
                        </IonItemOption>
                        <IonItemOption color="primary">
                            <div
                                className="itemOption"
                                onClick={() => copyImmobile(immobile.id!)}
                            >
                                <IonIcon icon={copyOutline} size="large" />
                                <IonText>Copia</IonText>
                            </div>
                        </IonItemOption>
                        <IonItemOption color="link">
                            <div
                                className="itemOption"
                                onClick={() => {
                                    props.setCurrentEntity(immobile);
                                    props.setMode("form");
                                }}
                            >
                                <IonIcon icon={createOutline} size="large" />
                                <IonText>Modifica</IonText>
                            </div>
                        </IonItemOption>
                        <IonItemOption color="danger">
                            <div
                                className="itemOption"
                                onClick={() =>
                                    props.deleteEntity(
                                        "immobili",
                                        immobile.id!.toString(),
                                        `Hai selezionato la cancellazione dell'immobile con riferimento ${immobile.ref}. Si tratta di un processo irreversibile.`
                                    )
                                }
                            >
                                <IonIcon icon={trashOutline} size="large" />
                                <IonText>Elimina</IonText>
                            </div>
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListImmobili;
