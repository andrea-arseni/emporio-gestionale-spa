import { IonItem, IonLabel } from "@ionic/react";
import { Log } from "../../entities/log.model";
import { getCorrectDate, getDayName, getHours } from "../../utils/timeUtils";

const ListLogs: React.FC<{
    logs: Log[];
}> = (props) => {
    const logs = props.logs.map((log: Log) => {
        const trueDate = getCorrectDate(new Date(log.data!));

        return (
            <IonItem key={log.id}>
                <IonLabel text-wrap>
                    <p>
                        {`${getDayName(trueDate, "long")} - ${getHours(
                            trueDate
                        )}`}
                    </p>
                    <h2>{log.azione}</h2>
                </IonLabel>
            </IonItem>
        );
    });

    return <>{logs}</>;
};

export default ListLogs;
