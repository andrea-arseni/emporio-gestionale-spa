import { User } from "./user.model";

export class Step {
    constructor(
        public id: number | null,
        public descrizione: string | null,
        public data: string | null,
        public user: User | null
    ) {}
}
