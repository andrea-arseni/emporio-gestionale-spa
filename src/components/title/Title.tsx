import { IonTitle } from "@ionic/react";
import useWindowSize from "../../hooks/use-size";
import styles from "./Title.module.css";

const Title: React.FC<{}> = (props) => {
    const [width] = useWindowSize();

    return (
        <div className={styles.toolbar}>
            {width >= 450 ? (
                <IonTitle>{props.children}</IonTitle>
            ) : (
                <div className="alignedCenter">{props.children}</div>
            )}
        </div>
    );
};

export default Title;
