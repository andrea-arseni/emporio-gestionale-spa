import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    useIonAlert,
    IonLoading,
} from "@ionic/react";
import {
    createOutline,
    folderOutline,
    openOutline,
    personAddOutline,
    trashOutline,
    trendingDownOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Entity } from "../../entities/entity";
import styles from "./Lists.module.css";
import { Persona } from "../../entities/persona.model";
import { getPersonaNameColor } from "../../utils/statusHandler";
import useWindowSize from "../../hooks/use-size";
import ItemOption from "./ItemOption";
import useSelection from "../../hooks/use-selection";
import { isNativeApp, saveContact } from "../../utils/contactUtils";
import { isUserAdmin } from "../../utils/userUtils";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { getDayName } from "../../utils/timeUtils";
import useErrorHandler from "../../hooks/use-error-handler";
import axiosInstance from "../../utils/axiosInstance";

const ListPersone: React.FC<{
    persone: Persona[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    closeItems: () => void;
    selectMode: boolean;
    performUpdate: () => void;
}> = (props) => {
    const navigate = useNavigate();

    const [width] = useWindowSize();

    const [presentAlert] = useIonAlert();

    const { errorHandler } = useErrorHandler();

    const userData = useAppSelector((state) => state.auth.userData);

    const goToData = (id: number) => {
        navigate(`/persone/${id.toString()}/storia`);
    };

    const { selectEntity, entitySelected } = useSelection(
        props.setCurrentEntity
    );

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const disattivaPersona = async (id: number) => {
        // loading
        setShowLoading(true);
        try {
            // query di update
            await axiosInstance.patch(`persone/${id}`, {
                status: "D_DISATTIVA",
            });
            props.performUpdate();
            setShowLoading(false);
        } catch (e) {
            setShowLoading(false);
            // error handling
            errorHandler(e, "Disattivazione non riuscita");
        }
    };

    const getTelefono = (persona: Persona) => {
        if (!persona.telefono) return <p>{"Telefono mancante"}</p>;
        if (props.selectMode) return <p>{`Tel: ${persona.telefono}`}</p>;
        return (
            <p>
                Tel:{" "}
                <a
                    className={
                        persona.status?.toUpperCase() === "E_EVITA" ||
                        persona.status?.toUpperCase() === "D_DISATTIVA"
                            ? "lightLink"
                            : ""
                    }
                    href={`tel:${persona.telefono}`}
                >
                    {persona.telefono}
                </a>
            </p>
        );
    };

    const getEmail = (persona: Persona) => {
        if (!persona.email) return <p>{"Email mancante"}</p>;
        if (props.selectMode) return <p>{`Email: ${persona.email}`}</p>;
        return (
            <p>
                Email:{" "}
                <a
                    className={
                        persona.status?.toUpperCase() === "E_EVITA" ||
                        persona.status?.toUpperCase() === "D_DISATTIVA"
                            ? "lightLink"
                            : ""
                    }
                    href={`mailto:${persona.email}`}
                >
                    {width >= 450 ? persona.email : "Email"}
                </a>
            </p>
        );
    };

    const getData = (data: Date) => {
        return (
            <p>
                Ultimo contatto:{" "}
                {getDayName(data, width >= 450 ? "long" : "short")}
            </p>
        );
    };

    const getPersona = (persona: Persona) => {
        return (
            <IonItem
                key={persona.id}
                detail={!props.selectMode}
                color={
                    !props.selectMode
                        ? getPersonaNameColor(persona.status!.toLowerCase())
                        : entitySelected === persona.id
                        ? "secondary"
                        : undefined
                }
                onClick={() =>
                    props.selectMode ? selectEntity(persona) : null
                }
            >
                <IonLabel text-wrap>
                    <h2>{persona.nome} </h2>
                    {getTelefono(persona)}
                    {getEmail(persona)}
                    {getData(new Date(persona.data!))}
                </IonLabel>
                {width > 500 &&
                    (persona.ruolo ||
                        persona.immobili ||
                        persona.immobileInquilino) && (
                        <IonLabel>
                            {persona.ruolo && (
                                <p>{`Ruolo: ${persona.ruolo.toUpperCase()}`}</p>
                            )}
                            {persona.immobili && <p>{`Proprietario`}</p>}
                            {persona.immobileInquilino && <p>{`Inquilino`}</p>}
                        </IonLabel>
                    )}
                <IonNote
                    slot="end"
                    className={styles.note}
                    color={
                        !props.selectMode &&
                        (persona.status?.toUpperCase() === "E_EVITA" ||
                            persona.status?.toUpperCase() === "D_DISATTIVA")
                            ? "light"
                            : "dark"
                    }
                >
                    {persona.status!.toUpperCase().split("_")[1]}
                    <br />
                    {persona.provenienza &&
                        persona.provenienza.toUpperCase().replace("_", " ")}
                </IonNote>
            </IonItem>
        );
    };

    if (props.selectMode)
        return <>{props.persone.map((el) => getPersona(el))}</>;

    return (
        <>
            <IonLoading cssClass="loader" isOpen={showLoading} />

            {props.persone.map((persona: Persona) => (
                <IonItemSliding key={persona.id!} id={persona.id?.toString()}>
                    {getPersona(persona)}
                    <IonItemOptions side="end">
                        {persona.status?.toLowerCase() !== "d_disattiva" && (
                            <ItemOption
                                handler={() => {
                                    props.closeItems();
                                    disattivaPersona(persona.id!);
                                }}
                                colorType={"dark"}
                                icon={trendingDownOutline}
                                title={"Disattiva"}
                            />
                        )}
                        {isNativeApp && (
                            <ItemOption
                                handler={() => {
                                    props.closeItems();
                                    saveContact(
                                        presentAlert,
                                        persona,
                                        errorHandler
                                    );
                                }}
                                colorType={"tertiary"}
                                icon={personAddOutline}
                                title={"Rubrica"}
                            />
                        )}
                        <ItemOption
                            handler={() => goToData(persona.id!)}
                            colorType={"primary"}
                            icon={openOutline}
                            title={"Apri"}
                        />
                        <ItemOption
                            handler={() =>
                                navigate(`/persone/${persona.id}/files`)
                            }
                            colorType={"success"}
                            icon={folderOutline}
                            title={"Files"}
                        />
                        <ItemOption
                            handler={() => {
                                props.setCurrentEntity(persona);
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
                                        "persone",
                                        persona.id!.toString(),
                                        `Hai selezionato la cancellazione della persona selezionata. Si tratta di un processo irreversibile.`
                                    );
                                }}
                                colorType={"danger"}
                                icon={trashOutline}
                                title={"Elimina"}
                            />
                        )}
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListPersone;
