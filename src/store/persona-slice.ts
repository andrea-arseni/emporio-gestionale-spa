import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Persona } from "../entities/persona.model";

interface PersonaState {
    persona: Persona | null;
}

const initialState = {
    persona: null,
} as PersonaState;

const PersonaSlice = createSlice({
    name: "Persona",
    initialState,
    reducers: {
        setPersona(state, action: PayloadAction<Persona | null>) {
            state.persona = action.payload;
        },
    },
});

export const { setPersona } = PersonaSlice.actions;
export default PersonaSlice.reducer;
