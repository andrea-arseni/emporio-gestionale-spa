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
    peopleOutline,
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
import useSelection from "../../hooks/use-selection";
import ItemOption from "./ItemOption";
import ImmobileThumbnail from "../immobile-thumbnail/ImmobileThumbnail";
import FileSpecialiList from "../file-speciali-list/FileSpecialiList";
import { isUserAdmin } from "../../utils/userUtils";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { triggerImmobiliUpdate } from "../../store/immobile-slice";

const ListImmobili: React.FC<{
    immobili: Immobile[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    closeItems: () => void;
    selectMode: boolean;
    public?: boolean;
}> = (props) => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

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
                            dispatch(triggerImmobiliUpdate());
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

    const userData = useAppSelector((state) => state.auth.userData);

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
                <ImmobileThumbnail immobile={immobile} />
                <IonLabel text-wrap className={styles.label}>
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
                {width >= 750 && !props.public && (
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

    if (props.public) {
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
                                    handler={() => navigate("/contattaci")}
                                    colorType={"primary"}
                                    icon={peopleOutline}
                                    title={"Chiedi"}
                                />
                            </IonItemOptions>
                        </IonItemSliding>
                    );
                })}
            </>
        );
    }

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
                                handler={() => copyImmobile(immobile.id!)}
                                colorType={"primary"}
                                icon={copyOutline}
                                title={"Copia"}
                            />
                            <ItemOption
                                handler={() =>
                                    navigate(`/immobili/${immobile.id}/storia`)
                                }
                                colorType={"tertiary"}
                                icon={newspaperOutline}
                                title={"Storia"}
                            />
                            <ItemOption
                                handler={() =>
                                    navigate(`/immobili/${immobile.id}/files`)
                                }
                                colorType={"success"}
                                icon={cameraOutline}
                                title={"File"}
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
                            {isUserAdmin(userData) && (
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
