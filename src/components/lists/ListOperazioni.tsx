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
import { numberAsPrice } from "../../utils/numberUtils";
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
            <IonItem
                detail
                color={operazione.importo! > 0 ? "secondary" : "dark"}
            >
                <IonLabel text-wrap>
                    <p>{`${getDayName(new Date(operazione.data!), "long")} da ${
                        operazione.user?.name
                    }`}</p>
                    <h3>{operazione.descrizione}</h3>
                    <h2>{numberAsPrice(operazione.importo!)}</h2>
                </IonLabel>
            </IonItem>
            <IonItemOptions side="end">
                <ItemOption
                    handler={() => {
                        props.setCurrentEntity(operazione);
                        props.setMode("form");
                    }}
                    colorType={"light"}
                    icon={createOutline}
                    title={"Modifica"}
                />
                <ItemOption
                    handler={() =>
                        props.deleteEntity(
                            "operazioni",
                            operazione.id!.toString()
                        )
                    }
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
            <IonItem>
                <IonLabel>
                    <h2
                        style={{ textAlign: "center" }}
                    >{`Saldo per questa lista: ${numberAsPrice(saldo)}`}</h2>
                </IonLabel>
            </IonItem>
        </>
    );
};

export default ListOperazioni;
