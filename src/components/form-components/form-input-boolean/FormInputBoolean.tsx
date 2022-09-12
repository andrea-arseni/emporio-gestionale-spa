import { IonItem, IonLabel } from "@ionic/react";
import { Dispatch, SetStateAction } from "react";
import styles from "./FormInputBoolean.module.css";

const FormInputBoolean: React.FC<{
    condition: boolean | null;
    setCondition: Dispatch<SetStateAction<boolean | null>> | any;
    sentence: string;
}> = (props) => {
    return (
        <IonItem className={styles.formInputBoolean}>
            <IonLabel position="floating" className={styles.label}>
                {props.sentence}
            </IonLabel>
            <div className="toggleButton">
                <div
                    className={props.condition ? "active" : "inactive"}
                    onClick={() => props.setCondition(true)}
                >
                    Sì
                </div>
                <div
                    className={props.condition ? "inactive" : "active"}
                    onClick={() => props.setCondition(false)}
                >
                    No
                </div>
            </div>
        </IonItem>
    );
};

export default FormInputBoolean;
