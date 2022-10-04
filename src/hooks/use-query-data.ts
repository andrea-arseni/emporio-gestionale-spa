import { useState } from "react";
import { entitiesType } from "../entities/entity";
import { Filtro } from "../entities/filtro.model";

const useQueryData = (entitiesType: entitiesType) => {
    const getInitialSorting = () => {
        switch (entitiesType) {
            case "lavori":
                return "status";
            case "immobili":
                return "ref";
            case "documenti":
                return "nome";
            case "persone":
                return "status";
            default:
                return "data";
        }
    };

    const [sort, setSort] = useState<string>(getInitialSorting());

    const [filter, setFilter] = useState<Filtro>({
        filter: undefined,
    });

    const [page, setPage] = useState<number>(1);

    const [update, setUpdate] = useState<number>(0);

    return {
        filter,
        setFilter,
        sort,
        setSort,
        page,
        setPage,
        update,
        setUpdate,
    };
};

export default useQueryData;
