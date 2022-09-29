import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonText,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import { Evento } from "../../entities/evento.model";
import { getDateAndTime } from "../../utils/timeUtils";

const ListEventi: React.FC<{
    eventi: Evento[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
}> = (props) => {
    const getColor = (evento: Evento) => {
        let matchFound: boolean = false;
        const paroleChiave = [
            "Visita modificata: ora fissata il",
            "Visita annullata",
            "Visita fissata il ",
        ];
        paroleChiave.forEach((el) => {
            if (evento.descrizione?.includes(el)) matchFound = true;
        });
        return matchFound ? "tertiary" : "undefined";
    };

    return (
        <>
            {props.eventi.map((evento: Evento) => {
                return (
                    <IonItemSliding key={evento.id!} id={evento.id?.toString()}>
                        <IonItem detail color={getColor(evento)}>
                            <IonLabel text-wrap>
                                <p>{`${getDateAndTime(evento.data!)} ${
                                    evento.user && evento.user.name
                                        ? `inserito da ${evento.user.name}`
                                        : ""
                                }`}</p>
                                <h2>{evento.descrizione}</h2>
                                {evento.immobile && (
                                    <>
                                        <p>{`Interessato al Ref. ${evento.immobile.ref}: ${evento.immobile.titolo}`}</p>
                                        <p>{`${evento.immobile.indirizzo} (${evento.immobile.comune})`}</p>
                                    </>
                                )}
                            </IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            <IonItemOption color="link">
                                <div
                                    className="itemOption"
                                    onClick={() => {
                                        props.setCurrentEntity(evento);
                                        props.setMode("form");
                                    }}
                                >
                                    <IonIcon
                                        icon={createOutline}
                                        size="large"
                                    />
                                    <IonText>Modifica</IonText>
                                </div>
                            </IonItemOption>
                            <IonItemOption color="danger">
                                <div
                                    className="itemOption"
                                    onClick={() =>
                                        props.deleteEntity(
                                            "eventi",
                                            evento.id!.toString(),
                                            `Hai selezionato la cancellazione dell'evento. Si tratta di un processo irreversibile. Lo status della persona non verrà modificato.`
                                        )
                                    }
                                >
                                    <IonIcon icon={trashOutline} size="large" />
                                    <IonText>Elimina</IonText>
                                </div>
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                );
            })}
        </>
    );
};

export default ListEventi;
