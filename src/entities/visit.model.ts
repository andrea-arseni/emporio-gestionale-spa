import { User } from "./user.model";

export class Visit {
    constructor(
        public id: number,
        public persona: Persona,
        public immobile: Immobile,
        public user: User,
        public dove: string,
        public quando: Date,
        public note: string
    ) {}
}

/* export class Persona {
    constructor(
        public KEY_Player: string,
        public LNK_Gender: string,
        public TXT_Email: string,
        public TXT_FirstName: string,
        public TXT_LastName: string,
        public TXT_PhoneNumber: number,
        public Competences: Competence[],
        public DTE_Birth: Date,
        public TXT_Notes: string,
        public selected: boolean = false
    ) {}
}  */
