import { Dispatch, SetStateAction } from "react";
import { useAppDispatch } from "../../../hooks";
import TwoDates from "../../two-dates/TwoDates";

const DateFilter: React.FC<{
    setFilter: any;
    filter: {
        filter: string | undefined;
        value?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
    localQuery?: boolean;
}> = (props) => {
    const dispatch = useAppDispatch();

    const submitForm = async (input: any) => {
        const filterObj = {
            filter: props.filter.filter,
            startDate: input.startDate!,
            endDate: input.endDate!,
        };
        props.localQuery
            ? props.setFilter(filterObj)
            : dispatch(props.setFilter(filterObj));
        props.setFilterMode("default");
    };

    return <TwoDates action={submitForm} text="Applica Filtro" />;
};

export default DateFilter;
