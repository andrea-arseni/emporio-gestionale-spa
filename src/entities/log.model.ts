import { User } from "./user.model";

export class Log {
    constructor(
        public id: number | null,
        public azione: string | null,
        public data: string | null,
        public user: User | null
    ) {}
}
