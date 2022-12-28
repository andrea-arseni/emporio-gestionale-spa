import { Fragment } from "react";
import { Immobile } from "../../entities/immobile.model";
import HouseCard from "./HouseCard/HouseCard";
import styles from "./HouseCards.module.css";

const HouseCards: React.FC<{
    listOfHouses: Immobile[];
}> = (props) => {
    const houseCards = props.listOfHouses.map((el) => (
        <Fragment key={el.id}>
            <HouseCard house={el} />
        </Fragment>
    ));
    return (
        <div className={`${styles.wrapper}`}>
            <div className={styles.houseList}>{houseCards}</div>
        </div>
    );
};

export default HouseCards;
