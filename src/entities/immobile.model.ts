import { Caratteristiche } from "./caratteristiche.model";
import { File } from "./file.model";
import { Log } from "./log.model";
import { Persona } from "./persona.model";

export class Immobile {
    constructor(
        public id: number | null,
        public ref: number | null,
        public titolo: string | null,
        public superficie: number | null,
        public proprietario: Persona | null,
        public tipologia: string | null,
        public locali: number | null,
        public indirizzo: string | null,
        public zona: string | null,
        public comune: string | null,
        public prezzo: number | null,
        public riscaldamento: string | null,
        public classeEnergetica: string | null,
        public consumo: number | null,
        public contratto: string | null,
        public categoria: string | null,
        public stato: string | null,
        public libero: string | null,
        public status: string | null,
        public piano: string | null,
        public caratteristiche: Caratteristiche | null,
        public logs: Log[] | null,
        public files: File[] | null,
        public inquilini: Persona[] | null
    ) {}
}
