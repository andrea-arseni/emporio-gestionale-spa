import { Immobile } from "./immobile.model";
import { User } from "./user.model";

export class Evento {
    constructor(
        public id: number,
        public data: Date,
        public descrizione: string,
        public immobile: Immobile,
        public user: User
    ) {}
}
