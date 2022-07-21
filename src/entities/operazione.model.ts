import { User } from "./user.model";

export class Operazione {
    constructor(
        public id: number,
        public importo: number,
        public data: Date,
        public descrizione: string,
        public user: User
    ) {}
}
