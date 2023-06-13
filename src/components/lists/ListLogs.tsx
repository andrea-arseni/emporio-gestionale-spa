import { IonItem, IonLabel } from "@ionic/react";
import { Log } from "../../entities/log.model";
import { capitalize } from "../../utils/stringUtils";
import { getDateAndTime } from "../../utils/timeUtils";
import { useCallback, useState } from "react";
import useUpAndDown from "../../hooks/use-up-and-down";
import React from "react";

const ListLogs: React.FC<{
    logs: Log[];
    ref?: any;
}> = React.forwardRef((props, ref: any) => {
    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.logs, selected, defineSelected, ref);

    const logs = props.logs.map((log: Log) => {
        return (
            <IonItem
                key={log.id}
                color={log.id === selected ? "primary" : "light"}
            >
                <IonLabel
                    text-wrap
                    color={log.id === selected ? "light" : "dark"}
                >
                    <p>{`${getDateAndTime(log.data!)}`}</p>
                    {log.user && log.user.name && (
                        <p>{capitalize(log.user.name)}</p>
                    )}
                    <h2>{capitalize(log.azione!)}</h2>
                </IonLabel>
            </IonItem>
        );
    });

    return <>{logs}</>;
});

export default ListLogs;
