import { useEffect, useState } from "react";
import { Visit } from "../../../entities/visit.model";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setTooltip } from "../../../store/appuntamenti-slice";
import { isPast } from "../../../utils/timeUtils";
import styles from "./CalendarItem.module.css";

const CalendarItem: React.FC<{
    dateAsString: string;
    openVisitForm: (visit: Visit | null) => void;
    visits: Visit[];
}> = (props) => {
    const time = props.dateAsString.split("T")[1].substring(0, 5);

    const date = new Date(props.dateAsString);

    const tooltipActivated = useAppSelector(
        (state) => state.appuntamenti.tooltipActivated
    );

    const [hourClicked, setHourClicked] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        let timeOut: NodeJS.Timeout | null = null;
        if (tooltipActivated === props.dateAsString)
            timeOut = setTimeout(() => {
                dispatch(setTooltip(null));
            }, 2000);
        return () => {
            if (timeOut) clearTimeout(timeOut);
        };
    }, [tooltipActivated, dispatch, props.dateAsString]);

    useEffect(() => {
        let timeOut: NodeJS.Timeout | null = null;
        if (hourClicked) {
            timeOut = setTimeout(() => {
                setHourClicked(null);
            }, 400);
        }
        return () => {
            if (timeOut) clearTimeout(timeOut);
        };
    }, [hourClicked]);

    const setVisit = (orario: string, visit: Visit | null) => {
        orario === hourClicked
            ? props.openVisitForm(visit)
            : setHourClicked(orario);
    };

    return (
        <>
            <div
                onClick={
                    isPast(date) || props.visits.length >= 2
                        ? () => dispatch(setTooltip(props.dateAsString))
                        : () =>
                              setVisit(
                                  props.dateAsString.split("T")[1],
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
                }
                className={`${styles.app} ${isPast(date) ? styles.past : ""}`}
                slot="start"
            >
                {props.dateAsString.split("T")[1]}
            </div>
            <div
                className={`${styles.tooltip} ${
                    (isPast(date) || props.visits.length >= 2) &&
                    tooltipActivated === props.dateAsString
                        ? styles.activated
                        : styles.deactivated
                } ${
                    time === "08:00"
                        ? styles.below
                        : time === "20:45"
                        ? styles.above
                        : ""
                }`}
            >
                {props.visits.length < 2
                    ? "Non è possibile mettere appuntamenti nel passato"
                    : "Troppe visite già presenti, non è possibile aggiungerne di nuove"}
            </div>
        </>
    );
};

export default CalendarItem;
