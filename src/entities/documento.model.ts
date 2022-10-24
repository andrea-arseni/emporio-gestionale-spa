import { Immobile } from "./immobile.model";
import { Persona } from "./persona.model";

export class Documento {
    constructor(
        public id: number | null,
        public nome: string | null,
        public tipologia: string | null,
        public codiceBucket: string | null,
        public immobile?: Immobile,
        public persona?: Persona,
        public base64String?: string
    ) {}
}
