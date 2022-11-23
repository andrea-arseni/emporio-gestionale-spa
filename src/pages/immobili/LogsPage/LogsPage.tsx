import Selector from "../../../components/selector/Selector";
import useQueryData from "../../../hooks/use-query-data";

const LogsPage: React.FC<{ id: string }> = (props) => {
    const baseUrl = `/immobili/${props.id}/logs`;

    const queryData = useQueryData("logs");

    return (
        <Selector
            entitiesType={"logs"}
            baseUrl={baseUrl}
            queryData={queryData}
        />
    );
};

export default LogsPage;
