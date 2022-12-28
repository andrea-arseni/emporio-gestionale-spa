import styles from "./ServiceCard.module.css";

const ServiceCard: React.FC<{
    imageSrc: string;
    message: string;
    onClick: () => void;
}> = (props) => {
    return (
        <div onClick={props.onClick} className={`centered ${styles.card}`}>
            <header className={`centered ${styles.header}`}>
                <img alt="Non disponibile" src={props.imageSrc} />
            </header>
            <main className={`centered ${styles.main}`}>{props.message}</main>
        </div>
    );
};

export default ServiceCard;
