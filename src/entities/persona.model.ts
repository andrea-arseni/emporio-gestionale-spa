import { Evento } from "./evento.model";
import { File } from "./file.model";
import { Immobile } from "./immobile.model";

export class Persona {
    constructor(
        public id: number,
        public nome: string,
        public telefono: string,
        public email: string,
        public isProprietario: boolean,
        public isInquilino: boolean,
        public isImportante: boolean,
        public ruolo: string,
        public immobili: Immobile[],
        public eventi: Evento[],
        public files: File[],
        public dataUscita: Date,
        public provenienza: string,
        public status: string
    ) {}
}
