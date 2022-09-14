import { bookOutline } from "ionicons/icons";
import { useLocation } from "react-router";
import List from "../../components/list/List";

const LogsPage: React.FC<{}> = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const baseUrl = `/immobili/${id}/logs`;

    return (
        <div className="page">
            <List
                entitiesType={"logs"}
                icon={bookOutline}
                title={"Storia dell'immobile"}
                static
                baseUrl={baseUrl}
            />
        </div>
    );
};

export default LogsPage;
