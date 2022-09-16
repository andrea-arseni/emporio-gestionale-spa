import { IonItem, IonLabel } from "@ionic/react";
import { Log } from "../../entities/log.model";
import capitalize from "../../utils/capitalize";
import { getDateAndTime } from "../../utils/timeUtils";

const ListLogs: React.FC<{
    logs: Log[];
}> = (props) => {
    const logs = props.logs.map((log: Log) => {
        return (
            <IonItem key={log.id}>
                <IonLabel text-wrap>
                    <p>{`${getDateAndTime(log.data!)}`}</p>
                    {log.user && log.user.name && (
                        <p>{capitalize(log.user.name)}</p>
                    )}
                    <h2>{log.azione}</h2>
                </IonLabel>
            </IonItem>
        );
    });

    return <>{logs}</>;
};

export default ListLogs;
