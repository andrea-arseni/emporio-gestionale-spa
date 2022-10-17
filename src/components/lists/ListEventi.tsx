import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import { Evento } from "../../entities/evento.model";
import { getDateAndTime } from "../../utils/timeUtils";
import ItemOption from "./ItemOption";

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
        return matchFound ? "tertiary" : undefined;
    };

    const getDescrizione = (evento: Evento) => {
        if (
            evento.descrizione &&
            evento.descrizione.indexOf("[") === 0 &&
            evento.descrizione.includes("]")
        ) {
            const primaParte = evento.descrizione
                .substring(1)
                .split("]")[0]
                .trim();
            const secondaParte = evento.descrizione.split("]")[1].trim();
            return (
                <>
                    <p style={{ color: "#3880ff" }}>
                        Status cambiato: {primaParte}
                    </p>
                    <h2>{secondaParte}</h2>
                </>
            );
        }
        return <h2>{evento.descrizione}</h2>;
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
                                {getDescrizione(evento)}
                                {evento.immobile && (
                                    <>
                                        <p>{`Interessato al Ref. ${evento.immobile.ref}: ${evento.immobile.titolo}`}</p>
                                        <p>{`${evento.immobile.indirizzo} (${evento.immobile.comune})`}</p>
                                    </>
                                )}
                            </IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            <ItemOption
                                handler={() => {
                                    props.setCurrentEntity(evento);
                                    props.setMode("form");
                                }}
                                colorType={"light"}
                                icon={createOutline}
                                title={"Modifica"}
                            />
                            <ItemOption
                                handler={() =>
                                    props.deleteEntity(
                                        "eventi",
                                        evento.id!.toString(),
                                        `Hai selezionato la cancellazione dell'evento. Si tratta di un processo irreversibile. Lo status della persona non verrà modificato.`
                                    )
                                }
                                colorType={"danger"}
                                icon={trashOutline}
                                title={"Elimina"}
                            />
                        </IonItemOptions>
                    </IonItemSliding>
                );
            })}
        </>
    );
};

export default ListEventi;
