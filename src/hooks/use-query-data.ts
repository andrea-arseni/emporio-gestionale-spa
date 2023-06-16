import { useCallback, useEffect, useState } from "react";
import { entitiesType } from "../entities/entity";
import { Filtro } from "../entities/filtro.model";

const useQueryData = (entitiesType: entitiesType) => {
    const getInitialSorting = useCallback(() => {
        switch (entitiesType) {
            case "lavori":
                return "status";
            case "immobili":
                return "default";
            case "documenti":
                return "nome";
            case "persone":
                return "status";
            case "visite":
                return "quando";
            default:
                return "data";
        }
    }, [entitiesType]);

    const [localSort, localSetSort] = useState<string>("");

    useEffect(() => {
        localSetSort(getInitialSorting());
    }, [getInitialSorting]);

    const [localFilter, localSetFilter] = useState<Filtro>({
        filter: undefined,
    });

    const [localPage, localSetPage] = useState<number>(1);

    const [localUpdate, localSetUpdate] = useState<number>(0);

    const localResetQueryData = () => {
        localSetSort(getInitialSorting());
        localSetFilter({
            filter: undefined,
        });
        localSetPage(1);
        localSetUpdate((update) => ++update);
    };

    return {
        localFilter,
        localSetFilter,
        localSort,
        localSetSort,
        localPage,
        localSetPage,
        localUpdate,
        localSetUpdate,
        localResetQueryData,
    };
};

export default useQueryData;
