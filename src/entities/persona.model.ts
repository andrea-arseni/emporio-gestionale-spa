import { Evento } from "./evento.model";
import { File } from "./file.model";
import { Immobile } from "./immobile.model";

export class Persona {
    constructor(
        public id: number | null,
        public nome: string | null,
        public telefono: string | null,
        public email: string | null,
        public isProprietario: boolean | null,
        public isInquilino: boolean | null,
        public isImportante: boolean | null,
        public ruolo: string | null,
        public immobili: Immobile[] | null,
        public eventi: Evento[] | null,
        public files: File[] | null,
        public dataUscita: string | null,
        public provenienza: string | null,
        public status: string | null
    ) {}
}
