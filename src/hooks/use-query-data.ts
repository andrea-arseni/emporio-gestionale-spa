import { useState } from "react";
import { entitiesType } from "../entities/entity";
import { Filtro } from "../entities/filtro.model";

const useQueryData = (entitiesType: entitiesType) => {
    const getInitialSorting = () => {
        switch (entitiesType) {
            case "operazioni":
                return "data";
            case "lavori":
                return "status";
            case "immobili":
                return "ref";
            case "persone":
                return "status";
            default:
                return "";
        }
    };

    const [sort, setSort] = useState<string>(getInitialSorting());

    const [filter, setFilter] = useState<Filtro>({
        filter: undefined,
    });

    const [page, setPage] = useState<number>(1);

    return { filter, setFilter, sort, setSort, page, setPage };
};

export default useQueryData;
