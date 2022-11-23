import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    folderOutline,
    openOutline,
    personAddOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
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

const ListPersone: React.FC<{
    persone: Persona[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
    closeItems: () => void;
    selectMode: boolean;
}> = (props) => {
    const navigate = useNavigate();

    const [width] = useWindowSize();

    const [presentAlert] = useIonAlert();

    const userData = useAppSelector((state) => state.auth.userData);

    const goToData = (id: number) => {
        navigate(`/persone/${id.toString()}`);
    };

    const { selectEntity, entitySelected } = useSelection(
        props.setCurrentEntity
    );

    const getTelefono = (persona: Persona) => {
        if (!persona.telefono) return <p>{"Telefono mancante"}</p>;
        if (props.selectMode) return <p>{`Tel: ${persona.telefono}`}</p>;
        return (
            <p>
                Tel:
                <a href={`tel:${persona.telefono}`}>{persona.telefono}</a>
            </p>
        );
    };

    const getEmail = (persona: Persona) => {
        if (!persona.email) return <p>{"Email mancante"}</p>;
        if (props.selectMode) return <p>{`Email: ${persona.email}`}</p>;
        return (
            <p>
                Email:{" "}
                <a href={`mailto:${persona.email}`}>
                    {width >= 450 ? persona.email : "Email"}
                </a>
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
                        persona.status?.toUpperCase() === "NON_RICHIAMARE" ||
                        persona.status?.toUpperCase() === "NON RICHIAMARE" ||
                        persona.status?.toUpperCase() === "RIPOSO"
                            ? "light"
                            : "dark"
                    }
                >
                    {persona.status === "RIPOSO"
                        ? "DISATTIVA"
                        : persona.status!.toUpperCase().replace("_", " ")}
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
            {props.persone.map((persona: Persona) => (
                <IonItemSliding key={persona.id!} id={persona.id?.toString()}>
                    {getPersona(persona)}
                    <IonItemOptions side="end">
                        {isNativeApp && (
                            <ItemOption
                                handler={() => {
                                    props.closeItems();
                                    saveContact(presentAlert, persona);
                                }}
                                colorType={"dark"}
                                icon={personAddOutline}
                                title={"Aggiungi"}
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
