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
    business,
    createOutline,
    folderOutline,
    homeOutline,
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
import capitalize from "../../utils/capitalize";

const ListPersone: React.FC<{
    persone: Persona[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
    closeItems: () => void;
}> = (props) => {
    const history = useHistory();

    const [width] = useWindowSize();

    const goToData = (id: number) => {
        history.push(`/persone/${id.toString()}`);
    };

    return (
        <>
            {props.persone.map((persona: Persona) => (
                <IonItemSliding key={persona.id!} id={persona.id?.toString()}>
                    <IonItem
                        detail
                        color={getPersonaNameColor(
                            persona.status!.toLowerCase()
                        )}
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
                                        {persona.email}
                                    </a>
                                ) : (
                                    "Mancante"
                                )}
                            </p>
                        </IonLabel>
                        {width > 500 &&
                            (persona.ruolo ||
                                persona.proprietario ||
                                persona.inquilino) && (
                                <IonLabel>
                                    {persona.ruolo && (
                                        <p>{`Ruolo: ${persona.ruolo.toUpperCase()}`}</p>
                                    )}
                                    {persona.proprietario && (
                                        <p>{`Proprietario`}</p>
                                    )}
                                    {persona.inquilino && <p>{`Inquilino`}</p>}
                                </IonLabel>
                            )}
                        <IonNote slot="end" className={styles.note}>
                            <div>
                                {persona.status!.toUpperCase()}
                                {persona.provenienza && (
                                    <p>
                                        {capitalize(
                                            persona.provenienza.toLowerCase()
                                        )}
                                    </p>
                                )}
                            </div>
                        </IonNote>
                    </IonItem>
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
                        {persona.proprietario && (
                            <IonItemOption color="secondary">
                                <div
                                    className={`itemOption ${
                                        width > 500
                                            ? styles.normalWidth
                                            : styles.littleWidth
                                    }`}
                                    onClick={() => {}}
                                >
                                    <IonIcon
                                        icon={homeOutline}
                                        size={width > 500 ? "large" : "small"}
                                    />
                                    {width > 500 ? (
                                        <IonText>Case</IonText>
                                    ) : (
                                        <p className={styles.little}>Case</p>
                                    )}
                                </div>
                            </IonItemOption>
                        )}
                        {persona.inquilino && (
                            <IonItemOption color="warning">
                                <div
                                    className={`itemOption ${
                                        width > 500
                                            ? styles.normalWidth
                                            : styles.littleWidth
                                    }`}
                                    onClick={() => {}}
                                >
                                    <IonIcon
                                        icon={business}
                                        size={width > 500 ? "large" : "small"}
                                    />
                                    {width > 500 ? (
                                        <IonText>Casa Locata</IonText>
                                    ) : (
                                        <p className={styles.little}>
                                            Casa Locata
                                        </p>
                                    )}
                                </div>
                            </IonItemOption>
                        )}
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
                                        "immobili",
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
