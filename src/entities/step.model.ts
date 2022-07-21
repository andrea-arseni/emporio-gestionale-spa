import { User } from "./user.model";

export class Step {
    constructor(
        public id: number,
        public descrizione: string,
        public data: Date,
        public user: User
    ) {}
}
