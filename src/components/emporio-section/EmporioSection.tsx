import useWindowSize from "../../hooks/use-size";
import styles from "./EmporioSection.module.css";

const EmporioSection: React.FC<{
    title: string;
    image: string;
    type: "white" | "black";
}> = (props) => {
    const [width] = useWindowSize();

    return (
        <section
            className={`bordered centered ${width <= 991 ? "vertical" : ""} ${
                styles.section
            } ${styles[props.type]}`}
        >
            {width <= 991 && (
                <div className={`centered ${styles.imgWrapper}`}>
                    <img
                        className={styles.img}
                        alt="Non disponibile"
                        src={props.image}
                    />
                </div>
            )}
            <div className={styles.textWrapper}>
                <h3 className={styles.text}>{props.title}</h3>
                <p className={styles.text}>{props.children}</p>
            </div>
            {width > 991 && (
                <div className={`${styles.aligner} centered`}>
                    <div className={`centered ${styles.imgWrapper}`}>
                        <img
                            className={styles.img}
                            alt="Non disponibile"
                            src={props.image}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default EmporioSection;
