import { Documento } from "./documento.model";
import { Evento } from "./evento.model";
import { Immobile } from "./immobile.model";

export class Persona {
    constructor(
        public id: number | null,
        public nome: string | null,
        public telefono: string | null,
        public email: string | null,
        public ruolo: string | null,
        public immobili: Immobile[] | number[] | null,
        public immobileInquilino: Immobile | number | null,
        public eventi: Evento[] | null,
        public files: Documento[] | null,
        public provenienza: string | null,
        public status: string | null,
        public data: string | null
    ) {}
}
