import { entitiesType } from "../entities/entity";
import { Filtro } from "../entities/filtro.model";
import { RootState } from "../store";
import {
    resetAppuntamentiQueryData,
    setAppuntamentiFilter,
    setAppuntamentiPaging,
    setAppuntamentiSorting,
    triggerAppuntamentiUpdate,
} from "../store/appuntamenti-slice";
import {
    resetDocumentiQueryData,
    setDocumentiFilter,
    setDocumentiPaging,
    setDocumentiSorting,
    triggerDocumentiUpdate,
} from "../store/documenti-slice";
import {
    resetEventiQueryData,
    setEventiFilter,
    setEventiPaging,
    setEventiSorting,
    triggerEventiUpdate,
} from "../store/eventi-slice";
import {
    resetImmobiliQueryData,
    setImmobiliFilter,
    setImmobiliPaging,
    setImmobiliSorting,
    triggerImmobiliUpdate,
} from "../store/immobile-slice";
import {
    resetLavoriQueryData,
    setLavoriFilter,
    setLavoriPaging,
    setLavoriSorting,
    triggerLavoriUpdate,
} from "../store/lavori-slice";
import {
    resetLogsQueryData,
    setLogsFilter,
    setLogsPaging,
    setLogsSorting,
    triggerLogsUpdate,
} from "../store/logs-slice";
import {
    resetOperazioniQueryData,
    setOperazioniFilter,
    setOperazioniPaging,
    setOperazioniSorting,
    triggerOperazioniUpdate,
} from "../store/operazioni-slice";
import {
    resetPersoneQueryData,
    setPersoneFilter,
    setPersonePaging,
    setPersoneSorting,
    triggerPersoneUpdate,
} from "../store/persona-slice";
import {
    resetStepsQueryData,
    setStepsFilter,
    setStepsPaging,
    setStepsSorting,
    triggerStepsUpdate,
} from "../store/steps-slice";

export const getQueryDataUtils = (
    state: RootState,
    entitiesType: entitiesType
) => {
    switch (entitiesType) {
        case "documenti":
            return state.documento.queryData;
        case "eventi":
            return state.evento.queryData;
        case "lavori":
            return state.lavoro.queryData;
        case "logs":
            return state.log.queryData;
        case "operazioni":
            return state.operazione.queryData;
        case "persone":
            return state.persona.queryData;
        case "steps":
            return state.steps.queryData;
        case "visite":
            return state.appuntamenti.queryData;
        default:
            return state.immobile.queryData;
    }
};

export const setFilterUtils = (filter: Filtro, entitiesType: entitiesType) => {
    switch (entitiesType) {
        case "documenti":
            return setDocumentiFilter(filter);
        case "eventi":
            return setEventiFilter(filter);
        case "lavori":
            return setLavoriFilter(filter);
        case "logs":
            return setLogsFilter(filter);
        case "operazioni":
            return setOperazioniFilter(filter);
        case "persone":
            return setPersoneFilter(filter);
        case "steps":
            return setStepsFilter(filter);
        case "visite":
            return setAppuntamentiFilter(filter);
        default:
            return setImmobiliFilter(filter);
    }
};

export const setSortingUtils = (
    sortingString: string,
    entitiesType: entitiesType
) => {
    switch (entitiesType) {
        case "documenti":
            return setDocumentiSorting(sortingString);
        case "eventi":
            return setEventiSorting(sortingString);
        case "lavori":
            return setLavoriSorting(sortingString);
        case "logs":
            return setLogsSorting(sortingString);
        case "operazioni":
            return setOperazioniSorting(sortingString);
        case "persone":
            return setPersoneSorting(sortingString);
        case "steps":
            return setStepsSorting(sortingString);
        case "visite":
            return setAppuntamentiSorting(sortingString);
        default:
            return setImmobiliSorting(sortingString);
    }
};

export const setPagingUtils = (
    pageNumber: number,
    entitiesType: entitiesType
) => {
    switch (entitiesType) {
        case "documenti":
            return setDocumentiPaging(pageNumber);
        case "eventi":
            return setEventiPaging(pageNumber);
        case "lavori":
            return setLavoriPaging(pageNumber);
        case "logs":
            return setLogsPaging(pageNumber);
        case "operazioni":
            return setOperazioniPaging(pageNumber);
        case "persone":
            return setPersonePaging(pageNumber);
        case "steps":
            return setStepsPaging(pageNumber);
        case "visite":
            return setAppuntamentiPaging(pageNumber);
        default:
            return setImmobiliPaging(pageNumber);
    }
};

export const triggerUpdateUtils = (entitiesType: entitiesType) => {
    switch (entitiesType) {
        case "documenti":
            return triggerDocumentiUpdate();
        case "eventi":
            return triggerEventiUpdate();
        case "lavori":
            return triggerLavoriUpdate();
        case "logs":
            return triggerLogsUpdate();
        case "operazioni":
            return triggerOperazioniUpdate();
        case "persone":
            return triggerPersoneUpdate();
        case "steps":
            return triggerStepsUpdate();
        case "visite":
            return triggerAppuntamentiUpdate();
        default:
            return triggerImmobiliUpdate();
    }
};

export const resetQueryDataUtils = (entitiesType: entitiesType) => {
    switch (entitiesType) {
        case "documenti":
            return resetDocumentiQueryData();
        case "eventi":
            return resetEventiQueryData();
        case "lavori":
            return resetLavoriQueryData();
        case "logs":
            return resetLogsQueryData();
        case "operazioni":
            return resetOperazioniQueryData();
        case "persone":
            return resetPersoneQueryData();
        case "steps":
            return resetStepsQueryData();
        case "visite":
            return resetAppuntamentiQueryData();
        default:
            return resetImmobiliQueryData();
    }
};
