import { Dispatch, SetStateAction } from "react";
import TwoDates from "../../two-dates/TwoDates";

const DateFilter: React.FC<{
    filter: {
        filter: string | undefined;
        value?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
    setFilter: Dispatch<
        SetStateAction<{
            filter: string | undefined;
            value?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
        }>
    >;
    setFilterMode: Dispatch<
        SetStateAction<
            "default" | "stringFilter" | "dataFilter" | "numberFilter"
        >
    >;
}> = (props) => {
    const submitForm = async (input: any) => {
        props.setFilter((filter) => {
            return {
                filter: filter.filter,
                startDate: input.startDate!,
                endDate: input.endDate!,
            };
        });
        props.setFilterMode("default");
    };

    return <TwoDates action={submitForm} text="Applica Filtro" />;
};

export default DateFilter;
