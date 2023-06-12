import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filtro } from "../entities/filtro.model";
import { queryData } from "../entities/queryData";
import { Step } from "../entities/step.model";

const INITIAL_QUERY_DATA: queryData = {
    filter: {
        filter: undefined,
    },
    sort: "data",
    page: 1,
    update: 0,
};

interface stepState {
    queryData: queryData;
    currentStep: Step | null;
}

const initialState = {
    queryData: INITIAL_QUERY_DATA,
    currentStep: null,
} as stepState;

const stepSlice = createSlice({
    name: "step",
    initialState,
    reducers: {
        setStepsFilter(state, action: PayloadAction<Filtro>) {
            state.queryData.filter = action.payload;
        },
        setStepsSorting(state, action: PayloadAction<string>) {
            state.queryData.sort = action.payload;
        },
        setStepsPaging(state, action: PayloadAction<number>) {
            state.queryData.page = action.payload;
        },
        triggerStepsUpdate(state) {
            state.queryData.update = ++state.queryData.update;
        },
        resetStepsQueryData(state) {
            state.queryData = INITIAL_QUERY_DATA;
        },
        setCurrentStep(state, action: PayloadAction<Step | null>) {
            state.currentStep = action.payload;
        },
    },
});

export const {
    setStepsFilter,
    setStepsSorting,
    setStepsPaging,
    triggerStepsUpdate,
    resetStepsQueryData,
    setCurrentStep,
} = stepSlice.actions;

export default stepSlice.reducer;
