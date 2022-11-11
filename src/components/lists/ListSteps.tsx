import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { Dispatch, SetStateAction } from "react";
import { Entity } from "../../entities/entity";
import { Step } from "../../entities/step.model";
import { getDateAndTime } from "../../utils/timeUtils";
import { isUserAdmin } from "../../utils/userUtils";
import ItemOption from "./ItemOption";

const ListSteps: React.FC<{
    steps: Step[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    setUpdate: Dispatch<SetStateAction<number>>;
}> = (props) => {
    const getDescrizione = (step: Step) => {
        if (step.descrizione && step.descrizione.includes("***")) {
            const primaParte = step.descrizione.split("***")[0].trim();
            const secondaParte = step.descrizione.split("***")[1].trim();
            return (
                <>
                    <p style={{ color: "#3880ff" }}>{primaParte}</p>
                    <h2>{secondaParte}</h2>
                </>
            );
        }
        return <h2>{step.descrizione}</h2>;
    };

    return (
        <>
            {props.steps.map((step: Step) => {
                return (
                    <IonItemSliding key={step.id!} id={step.id?.toString()}>
                        <IonItem detail>
                            <IonLabel text-wrap>
                                <p>{getDateAndTime(step.data!)}</p>
                                {getDescrizione(step)}
                                <p>{step.user?.name}</p>
                            </IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            <ItemOption
                                handler={() => {
                                    props.setCurrentEntity(step);
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
                                            "steps",
                                            step.id!.toString(),
                                            `Hai selezionato la cancellazione dello step. Si tratta di un processo irreversibile. Lo status del lavoro non verrà modificato.`
                                        );
                                    }}
                                    colorType={"danger"}
                                    icon={trashOutline}
                                    title={"Elimina"}
                                />
                            )}
                        </IonItemOptions>
                    </IonItemSliding>
                );
            })}
        </>
    );
};

export default ListSteps;
