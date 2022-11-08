import { Dispatch, SetStateAction } from "react";
import useSize from "../../hooks/use-size";
import { getDayName, setWeek } from "../../utils/timeUtils";
import ArrowsBar from "../bars/arrows-bar/ArrowsBar";

const CalendarNavigator: React.FC<{
    currentDay: Date;
    setCurrentDay: Dispatch<SetStateAction<Date>>;
    mode: "day" | "day-week";
}> = (props) => {
    const [widthScreen] = useSize();

    const mode = props.mode === "day" || widthScreen < 700 ? "day" : "week";

    const getTitolo = () => {
        if (mode === "day")
            return getDayName(
                props.currentDay,
                widthScreen > 385 ? "long" : "short"
            );
        const week = setWeek(props.currentDay);
        return `Da ${getDayName(week[0].date, "long")} a ${getDayName(
            week[5].date,
            "long"
        )}`;
    };

    const moveInTime = (direction: "forward" | "backward") => {
        let offset =
            direction === "backward"
                ? -1000 * 60 * 60 * 24
                : +1000 * 60 * 60 * 24;

        if (mode === "week") offset = offset * 7;
        let newDay = new Date(props.currentDay.getTime() + offset);
        if (newDay.getDay() === 0)
            newDay = new Date(
                newDay.getTime() +
                    (direction === "backward"
                        ? -1000 * 60 * 60 * 24
                        : +1000 * 60 * 60 * 24)
            );
        props.setCurrentDay(newDay);
    };

    return (
        <ArrowsBar
            moveBackward={moveInTime.bind(null, "backward")}
            moveForward={moveInTime.bind(null, "forward")}
            titolo={getTitolo()}
        />
    );
};

export default CalendarNavigator;
