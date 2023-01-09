import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";
import { Visit } from "../entities/visit.model";

type pageMode = "calendario" | "lista";

const getFirstDay = () =>
    new Date(
        Date.now() + 1000 * 60 * new Date().getTimezoneOffset()
    ).getDay() === 0
        ? new Date(
              Date.now() +
                  1000 * 60 * new Date().getTimezoneOffset() -
                  1000 * 60 * 60 * 24
          )
        : new Date(Date.now() + 1000 * 60 * new Date().getTimezoneOffset());

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "quando",
    page: 1,
    update: 0,
};
interface AppuntamentiState {
    currentDay: Date;
    tooltipActivated: string | null;
    currentVisit: Visit | null;
    pageMode: pageMode;
    isFormActive: boolean;
    queryData: queryData;
}

const initialState = {
    currentDay: getFirstDay(),
    tooltipActivated: null,
    currentVisit: null,
    pageMode: "calendario",
    isFormActive: false,
    queryData: INITIAL_QUERY_DATA,
} as AppuntamentiState;

const appuntamentiSlice = createSlice({
    name: "appuntamenti",
    initialState,
    reducers: {
        setCurrentDay(state, action: PayloadAction<Date>) {
            state.currentDay = action.payload;
        },
        setTooltip(state, action: PayloadAction<string | null>) {
            state.tooltipActivated = action.payload;
        },
        setCurrentVisit(state, action: PayloadAction<Visit | null>) {
            state.currentVisit = action.payload;
        },
        setPageMode(state, action: PayloadAction<pageMode>) {
            state.pageMode = action.payload;
        },
        setFormActive(state, action: PayloadAction<boolean>) {
            state.isFormActive = action.payload;
        },
        backToList(state) {
            state.currentVisit = null;
            state.isFormActive = false;
        },
        setAppuntamentiFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setAppuntamentiSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setAppuntamentiPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerAppuntamentiUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetAppuntamentiQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
    },
});

export const {
    setCurrentDay,
    setTooltip,
    setCurrentVisit,
    setPageMode,
    backToList,
    setFormActive,
    setAppuntamentiFilter,
    setAppuntamentiPaging,
    setAppuntamentiSorting,
    triggerAppuntamentiUpdate,
    resetAppuntamentiQueryData,
} = appuntamentiSlice.actions;
export default appuntamentiSlice.reducer;
