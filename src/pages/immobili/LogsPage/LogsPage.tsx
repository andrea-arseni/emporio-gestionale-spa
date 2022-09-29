import { IonContent } from "@ionic/react";
import { bookOutline } from "ionicons/icons";
import { useLocation } from "react-router";
import StaticBar from "../../../components/bars/static-bar/StaticBar";
import Selector from "../../../components/selector/Selector";
import useFilterAndSort from "../../../hooks/use-query-data";

const LogsPage: React.FC<{}> = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const baseUrl = `/immobili/${id}/logs`;

    const { filter, setFilter, sort, setSort, page, setPage } =
        useFilterAndSort("logs");

    return (
        <div className="page">
            <IonContent>
                <StaticBar icon={bookOutline} title={"Storia dell'immobile"} />
                <Selector
                    entitiesType={"logs"}
                    baseUrl={baseUrl}
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                    page={page}
                    setPage={setPage}
                />
            </IonContent>
        </div>
    );
};

export default LogsPage;
