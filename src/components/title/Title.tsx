import { IonTitle } from "@ionic/react";
import useWindowSize from "../../hooks/use-size";

const Title: React.FC<{}> = (props) => {
    const [width] = useWindowSize();

    return width >= 450 ? (
        <IonTitle>{props.children}</IonTitle>
    ) : (
        <p className="alignedCenter">{props.children}</p>
    );
};

export default Title;
