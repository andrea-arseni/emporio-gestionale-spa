import Selector from "../../../components/selector/Selector";
import useQueryData from "../../../hooks/use-query-data";

const PublicImmobiliPage: React.FC<{}> = () => {
    const queryData = useQueryData("immobili");

    return <Selector entitiesType="immobili" public queryData={queryData} />;
};

export default PublicImmobiliPage;
