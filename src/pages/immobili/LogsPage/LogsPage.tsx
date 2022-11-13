import { IonContent } from "@ionic/react";
import { bookOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import StaticBar from "../../../components/bars/static-bar/StaticBar";
import Selector from "../../../components/selector/Selector";
import useQueryData from "../../../hooks/use-query-data";

const LogsPage: React.FC<{}> = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const baseUrl = `/immobili/${id}/logs`;

    const queryData = useQueryData("logs");

    return (
        <div className="page">
            <IonContent>
                <StaticBar icon={bookOutline} title={"Storia dell'immobile"} />
                <Selector
                    entitiesType={"logs"}
                    baseUrl={baseUrl}
                    queryData={queryData}
                />
            </IonContent>
        </div>
    );
};

export default LogsPage;
