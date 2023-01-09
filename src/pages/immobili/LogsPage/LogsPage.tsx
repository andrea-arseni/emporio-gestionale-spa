import Selector from "../../../components/selector/Selector";

const LogsPage: React.FC<{ id: string }> = (props) => {
    const baseUrl = `/immobili/${props.id}/logs`;

    return <Selector localQuery entitiesType={"logs"} baseUrl={baseUrl} />;
};

export default LogsPage;
