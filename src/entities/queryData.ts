import { Dispatch, SetStateAction } from "react";
import { Filtro } from "./filtro.model";

export interface QueryData {
    filter: Filtro;
    setFilter: Dispatch<SetStateAction<Filtro>>;
    sort: string;
    setSort: Dispatch<SetStateAction<string>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    update: number;
    setUpdate: Dispatch<SetStateAction<number>>;
}
