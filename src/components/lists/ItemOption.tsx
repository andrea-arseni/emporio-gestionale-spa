import { IonItemOption, IonIcon, IonText } from "@ionic/react";
import { Entity } from "../../entities/entity";
import useWindowSize from "../../hooks/use-size";
import { colorType } from "../../types/color_types";
import styles from "./Lists.module.css";

const ItemOption: React.FC<{
    handler: (input: any | undefined) => void;
    entity: Entity;
    colorType: colorType;
    icon: string;
    title: string;
}> = (props) => {
    const [width] = useWindowSize();

    return (
        <IonItemOption color={props.colorType}>
            <div
                className={`itemOption ${
                    width > 500 ? styles.normalWidth : styles.littleWidth
                }`}
                onClick={() => props.handler(props.entity)}
            >
                <IonIcon
                    icon={props.icon}
                    size={width > 500 ? "large" : "small"}
                />
                {width > 500 ? (
                    <IonText>{props.title}</IonText>
                ) : (
                    <p className={styles.little}>{props.title}</p>
                )}
            </div>
        </IonItemOption>
    );
};

export default ItemOption;
