import { Immobile } from "./immobile.model";
import { User } from "./user.model";

export class Evento {
    constructor(
        public id: number | null,
        public data: string | null,
        public descrizione: string | null,
        public immobile: Immobile | null,
        public user: User | null
    ) {}
}
