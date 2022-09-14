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
import { Operazione } from "../../entities/operazione.model";
import { numberAsPrice } from "../../utils/numberAsPrice";
import { getDayName } from "../../utils/timeUtils";

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
                <IonItemOption
                    color="warning"
                    onClick={() => {
                        props.setCurrentEntity(operazione);
                        props.setMode("form");
                    }}
                >
                    <div className="itemOption">
                        <IonIcon icon={createOutline} size="large" />
                        <IonText>Modifica</IonText>
                    </div>
                </IonItemOption>
                <IonItemOption
                    color="danger"
                    onClick={() =>
                        props.deleteEntity(
                            "operazioni",
                            operazione.id!.toString()
                        )
                    }
                >
                    <div className="itemOption">
                        <IonIcon icon={trashOutline} size="large" />
                        <IonText>Elimina</IonText>
                    </div>
                </IonItemOption>
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
