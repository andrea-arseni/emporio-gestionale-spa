import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonText,
} from "@ionic/react";
import { createOutline, openOutline, trashOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import useWindowSize from "../../hooks/use-size";
import styles from "./Lists.module.css";
import { useHistory } from "react-router";
import { Lavoro } from "../../entities/lavoro.model";
import { getLavoroTitleColor } from "../../utils/statusHandler";
import ItemOption from "./ItemOption";
import { isUserAdmin } from "../../utils/userUtils";

const ListLavori: React.FC<{
    lavori: Lavoro[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
}> = (props) => {
    const history = useHistory();

    const [width] = useWindowSize();

    const goToData = (id: number) => {
        history.push(`/obiettivi/${id.toString()}`);
    };

    return (
        <>
            {props.lavori.map((lavoro: Lavoro) => (
                <IonItemSliding key={lavoro.id!} id={lavoro.id?.toString()}>
                    <IonItem detail color={getLavoroTitleColor(lavoro.status!)}>
                        <IonLabel text-wrap>
                            <h2>{lavoro.titolo} </h2>
                            {width < 600 && (
                                <IonText>
                                    {lavoro.status?.replace("_", " ")}
                                </IonText>
                            )}
                        </IonLabel>
                        {width >= 600 && (
                            <IonText
                                slot="end"
                                className={`${styles.note} ${styles.large}`}
                            >
                                {lavoro.status?.replace("_", " ")}
                            </IonText>
                        )}
                    </IonItem>
                    <IonItemOptions side="end">
                        <ItemOption
                            handler={() => goToData(lavoro.id!)}
                            colorType={"success"}
                            icon={openOutline}
                            title={"Apri"}
                        />
                        <ItemOption
                            handler={() => {
                                props.setCurrentEntity(lavoro);
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
                                        "lavori",
                                        lavoro.id!.toString(),
                                        `Hai selezionato la cancellazione del lavoro. Si tratta di un processo irreversibile.`
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

export default ListLavori;
