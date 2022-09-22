import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonText,
} from "@ionic/react";
import {
    createOutline,
    folderOutline,
    openOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import styles from "./Lists.module.css";
import { useHistory } from "react-router";
import { Persona } from "../../entities/persona.model";
import { getPersonaNameColor } from "../../utils/statusHandler";
import useWindowSize from "../../hooks/use-size";

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
    const history = useHistory();

    const [width] = useWindowSize();

    const goToData = (id: number) => {
        history.push(`/persone/${id.toString()}`);
    };

    const getPersona = (persona: Persona) => {
        return (
            <IonItem
                key={persona.id}
                detail={!props.selectMode}
                color={
                    !props.selectMode
                        ? getPersonaNameColor(persona.status!.toLowerCase())
                        : undefined
                }
            >
                <IonLabel text-wrap>
                    <h2>{persona.nome} </h2>
                    <p>
                        Tel:{" "}
                        {persona.telefono ? (
                            <a href={`tel:${persona.telefono}`}>
                                {persona.telefono}
                            </a>
                        ) : (
                            "Mancante"
                        )}
                    </p>
                    <p>
                        Email:{" "}
                        {persona.email ? (
                            <a href={`mailto:${persona.email}`}>
                                {width >= 450 ? persona.email : "Email"}
                            </a>
                        ) : (
                            "Mancante"
                        )}
                    </p>
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
                        persona.status === "NON_RICHIAMARE" ||
                        persona.status === "RIPOSO"
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

    return (
        <>
            {props.persone.map((persona: Persona) => (
                <IonItemSliding key={persona.id!} id={persona.id?.toString()}>
                    {getPersona(persona)}
                    <IonItemOptions side="end">
                        <IonItemOption color="primary">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => goToData(persona.id!)}
                            >
                                <IonIcon
                                    icon={openOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Apri</IonText>
                                ) : (
                                    <p className={styles.little}>Apri</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="success">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => {}}
                            >
                                <IonIcon
                                    icon={folderOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Files</IonText>
                                ) : (
                                    <p className={styles.little}>Files</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="link">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() => {
                                    props.setCurrentEntity(persona);
                                    props.setMode("form");
                                }}
                            >
                                <IonIcon
                                    icon={createOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Modifica</IonText>
                                ) : (
                                    <p className={styles.little}>Modifica</p>
                                )}
                            </div>
                        </IonItemOption>
                        <IonItemOption color="danger">
                            <div
                                className={`itemOption ${
                                    width > 500
                                        ? styles.normalWidth
                                        : styles.littleWidth
                                }`}
                                onClick={() =>
                                    props.deleteEntity(
                                        "persone",
                                        persona.id!.toString(),
                                        `Hai selezionato la cancellazione della persona selezionata. Si tratta di un processo irreversibile.`
                                    )
                                }
                            >
                                <IonIcon
                                    icon={trashOutline}
                                    size={width > 500 ? "large" : "small"}
                                />
                                {width > 500 ? (
                                    <IonText>Elimina</IonText>
                                ) : (
                                    <p className={styles.little}>Elimina</p>
                                )}
                            </div>
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </>
    );
};

export default ListPersone;
