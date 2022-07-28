import { User } from "./user.model";

export class Operazione {
    constructor(
        public id: number | null,
        public importo: number | null,
        public data: string | null,
        public descrizione: string | null,
        public user: User | null
    ) {}
}
