import { useState } from "react";
import { ReactComponent as Arrow } from "../../assets/icons/arrow.svg";
import { FeatureField } from "../../pages/immobili/Immobile/Immobile";
import { capitalize } from "../../utils/stringUtils";
import styles from "./FeaturesWrapper.module.css";

const FeaturesWrapper: React.FC<{
    title: string;
    features?: FeatureField[];
    contentVisible?: boolean;
}> = (props) => {
    const [isContentVisible, setIsContentVisible] = useState(
        props.contentVisible
    );

    const contentVisibilityToggler = () =>
        setIsContentVisible((prevState) => !prevState);

    let listaFeatures = null;

    if (props.features)
        listaFeatures = props.features.map((el) => (
            <div key={el.label} className={styles.frame}>
                <div
                    style={{
                        textTransform: "uppercase",
                        color: "rgb(11, 99, 242)",
                    }}
                >
                    {el.label}
                </div>
                <div style={{ fontStyle: "italic" }}>
                    {el.value.includes("kWh") ? el.value : capitalize(el.value)}
                </div>
            </div>
        ));

    return (
        <div className={`${styles.featureWrapper}`}>
            <h3
                className={`${styles.titleFrame}`}
                onClick={contentVisibilityToggler}
            >
                <span />
                <div className={`${styles.title}`}>{props.title}</div>
                <div
                    className={`centered ${styles.arrowWrapper} ${
                        isContentVisible ? styles.changed : ""
                    }`}
                >
                    <Arrow />
                </div>
            </h3>
            {isContentVisible && (
                <div className={`centered vertical ${styles.childrenWrapper}`}>
                    {props.features ? listaFeatures : props.children}
                </div>
            )}
        </div>
    );
};

export default FeaturesWrapper;
