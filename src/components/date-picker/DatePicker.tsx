import { IonDatetime } from "@ionic/react";
import ReactDOM from "react-dom";
import { isNotSunday } from "../../utils/timeUtils";
import styles from "./DatePicker.module.css";

const DatePicker: React.FC<{
    closePicker: () => void;
    minValue: string;
    maxValue: string;
    changeHandler: (e: any) => void;
    value?: string;
    sundayDisabled?: boolean;
}> = (props) => {
    return (
        <>
            {ReactDOM.createPortal(
                <div className={styles.background}>
                    <div
                        className={styles.backdrop}
                        onClick={props.closePicker}
                    ></div>
                    <IonDatetime
                        className={styles.datapicker}
                        mode="ios"
                        min={props.minValue}
                        max={props.maxValue}
                        locale="it-IT"
                        firstDayOfWeek={1}
                        onIonChange={(e) => props.changeHandler(e)}
                        size="fixed"
                        presentation="date"
                        isDateEnabled={
                            props.sundayDisabled ? isNotSunday : undefined
                        }
                    />
                </div>,
                document.querySelector("body")!
            )}
        </>
    );
};

export default DatePicker;
