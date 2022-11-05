import { useEffect } from "react";
import { Visit } from "../../../entities/visit.model";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setTooltip } from "../../../store/appuntamenti-slice";
import styles from "./CalendarItem.module.css";

const CalendarItem: React.FC<{
    dateAsString: string;
    openVisitForm: (visit: Visit | null) => void;
}> = (props) => {
    const date = new Date(props.dateAsString);

    const tooltipActivated = useAppSelector(
        (state) => state.appuntamenti.tooltipActivated
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tooltipActivated === props.dateAsString)
            setTimeout(() => {
                dispatch(setTooltip(null));
            }, 2000);
    }, [tooltipActivated, dispatch, props.dateAsString]);

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
                        : () => dispatch(setTooltip(props.dateAsString))
                }
                className={`${styles.app} ${isPast(date) ? styles.past : ""}`}
                slot="start"
            >
                {props.dateAsString.split("T")[1]}
            </div>
            <div
                className={`${styles.tooltip} ${
                    isPast(date) && tooltipActivated === props.dateAsString
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
