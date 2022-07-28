import { Immobile } from "./immobile.model";
import { Persona } from "./persona.model";
import { User } from "./user.model";

export class Visit {
    constructor(
        public id: number | null,
        public persona: Persona | null,
        public immobile: Immobile | null,
        public user: User | null,
        public dove: string | null,
        public quando: string | null,
        public note: string | null
    ) {}
}
