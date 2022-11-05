import { useEffect, useState } from "react";
import { Visit } from "../../../entities/visit.model";
import styles from "./CalendarItem.module.css";

const CalendarItem: React.FC<{
    dateAsString: string;
    openVisitForm: (visit: Visit | null) => void;
}> = (props) => {
    const date = new Date(props.dateAsString);

    const [tooltipActivated, setTooltipActivated] = useState<boolean>(false);

    useEffect(() => {
        if (tooltipActivated)
            setTimeout(() => {
                setTooltipActivated(false);
            }, 2000);
    }, [tooltipActivated]);

    const isPast = (dateProposed: Date) => {
        const nowTime = new Date().getTime();
        const thenTime = dateProposed.getTime();
        return nowTime > thenTime;
    };

    const setVisit = (e: any, visit: Visit | null) => {
        if (e.detail === 2) props.openVisitForm(visit);
    };

    return (
        <>
            <div
                onClick={
                    !isPast(date)
                        ? (e) =>
                              setVisit(
                                  e,
                                  new Visit(
                                      null,
                                      null,
                                      null,
                                      null,
                                      null,
                                      props.dateAsString,
                                      null
                                  )
                              )
                        : () => setTooltipActivated(true)
                }
                className={`${styles.app} ${isPast(date) ? styles.past : ""}`}
                slot="start"
            >
                {props.dateAsString.split("T")[1]}
            </div>
            <div
                className={`${styles.tooltip} ${
                    isPast(date) && tooltipActivated
                        ? styles.activated
                        : styles.deactivated
                }`}
            >
                Non è possibile mettere appuntamenti nel passato
            </div>
        </>
    );
};

export default CalendarItem;
