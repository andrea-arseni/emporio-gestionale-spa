import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import { Operazione } from "../../entities/operazione.model";
import { numberAsPrice } from "../../utils/numberAsPrice";
import { getDayName } from "../../utils/timeUtils";
import ItemOption from "./ItemOption";

const ListOperazioni: React.FC<{
    operazioni: Operazione[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string) => void;
}> = (props) => {
    const operazioni = props.operazioni.map((operazione: Operazione) => (
        <IonItemSliding key={operazione.id!} id={operazione.id?.toString()}>
            <IonItem detail>
                <IonLabel
                    text-wrap
                    color={operazione.importo! > 0 ? "primary" : "danger"}
                >
                    <h2>{`${operazione.descrizione} ( ${numberAsPrice(
                        operazione.importo!
                    )} )`}</h2>
                    <p>{`${getDayName(new Date(operazione.data!), "long")}`}</p>
                    <p>{operazione.user?.name}</p>
                </IonLabel>
            </IonItem>
            <IonItemOptions side="end">
                <ItemOption
                    handler={(input: Entity) => {
                        props.setCurrentEntity(input);
                        props.setMode("form");
                    }}
                    entity={operazione}
                    colorType={"light"}
                    icon={createOutline}
                    title={"Modifica"}
                />
                <ItemOption
                    handler={(operazione) =>
                        props.deleteEntity(
                            "operazioni",
                            operazione.id!.toString()
                        )
                    }
                    entity={operazione}
                    colorType={"danger"}
                    icon={trashOutline}
                    title={"Elimina"}
                />
            </IonItemOptions>
        </IonItemSliding>
    ));
    const saldo = props.operazioni
        .map((el) => el.importo!)
        .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        );
    return (
        <>
            {operazioni}
            <IonItem detail color={saldo! > 0 ? "primary" : "danger"}>
                <IonLabel>
                    <h2>{`Il Saldo complessivo per questa lista è ${numberAsPrice(
                        saldo
                    )}`}</h2>
                </IonLabel>
            </IonItem>
        </>
    );
};

export default ListOperazioni;
