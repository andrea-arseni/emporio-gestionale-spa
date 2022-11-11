import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    useIonAlert,
} from "@ionic/react";
import {
    cameraOutline,
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
import { numberAsPrice } from "../../utils/numberUtils";
import styles from "./Lists.module.css";
import { useHistory } from "react-router";
import useSelection from "../../hooks/use-selection";
import ItemOption from "./ItemOption";
import ImmobileThumbnail from "../immobile-thumbnail/ImmobileThumbnail";
import FileSpecialiList from "../file-speciali-list/FileSpecialiList";
import { isUserAdmin } from "../../utils/userUtils";

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
                {width >= 480 && <ImmobileThumbnail immobile={immobile} />}
                <IonLabel
                    text-wrap
                    className={width >= 480 ? styles.label : ""}
                >
                    <h3
                        style={{
                            color:
                                immobile.status?.toLowerCase() === "attivo"
                                    ? "#018937"
                                    : "#a40318",
                        }}
                    >
                        Riferimento {immobile.ref}
                    </h3>
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
                {width >= 750 && (
                    <IonNote slot="end" className={styles.note}>
                        <FileSpecialiList id={immobile.id!} />
                    </IonNote>
                )}
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
            {props.immobili.map((immobile: Immobile) => {
                return (
                    <IonItemSliding
                        key={immobile.id!}
                        id={immobile.id?.toString()}
                    >
                        {getImmobile(immobile)}
                        <IonItemOptions side="end">
                            <ItemOption
                                handler={() =>
                                    history.push(
                                        `/immobili/${immobile.id}/files`
                                    )
                                }
                                colorType={"primary"}
                                icon={cameraOutline}
                                title={"File"}
                            />
                            <ItemOption
                                handler={() =>
                                    history.push(
                                        `/immobili/${immobile.id}/storia`
                                    )
                                }
                                colorType={"tertiary"}
                                icon={newspaperOutline}
                                title={"Storia"}
                            />
                            <ItemOption
                                handler={() => copyImmobile(immobile.id!)}
                                colorType={"success"}
                                icon={copyOutline}
                                title={"Copia"}
                            />
                            <ItemOption
                                handler={() => {
                                    props.setCurrentEntity(immobile);
                                    props.setMode("form");
                                }}
                                colorType={"light"}
                                icon={createOutline}
                                title={"Modifica"}
                            />
                            {isUserAdmin() && (
                                <ItemOption
                                    handler={() => {
                                        props.deleteEntity(
                                            "immobili",
                                            immobile.id!.toString(),
                                            `Hai selezionato la cancellazione dell'immobile con riferimento ${immobile.ref}. Si tratta di un processo irreversibile.`
                                        );
                                    }}
                                    colorType={"danger"}
                                    icon={trashOutline}
                                    title={"Elimina"}
                                />
                            )}
                        </IonItemOptions>
                    </IonItemSliding>
                );
            })}
        </>
    );
};

export default ListImmobili;
