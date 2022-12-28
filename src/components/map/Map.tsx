import styles from "./Map.module.css";

const Map: React.FC<{}> = () => {
    return (
        <div className={`fullHeight centered ${styles.wrapper}`}>
            <iframe
                title="mappa"
                className={styles.map}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.7859845908615!2d9.292976714459773!3d45.49425429320095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c87a7618a477%3A0x87c133b2a73ae68d!2sEmporio%20Case%20Sas!5e0!3m2!1sit!2sit!4v1670798944879!5m2!1sit!2sit"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default Map;
