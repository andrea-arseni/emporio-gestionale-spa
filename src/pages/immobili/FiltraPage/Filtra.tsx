import { IonGrid, IonRow, IonCol } from "@ionic/react";
import FilterForm from "../../../components/forms/filter-form/FilterForm";
import styles from "./Filtra.module.css";

const Filtra: React.FC<{}> = () => {
    return (
        <IonGrid
            className={`text-center centered fullHeight ${styles.gradient}`}
        >
            <IonRow
                className={`text-center centered fullHeight ${styles.column}`}
            >
                <IonCol size="10">
                    <FilterForm />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Filtra;
