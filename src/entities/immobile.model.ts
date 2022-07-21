import { Caratteristiche } from "./caratteristiche.model";
import { File } from "./file.model";
import { Log } from "./log.model";
import { Persona } from "./persona.model";

export class Immobile {
    constructor(
        public id: number,
        public ref: number,
        public titolo: string,
        public superficie: number,
        public proprietario: Persona,
        public tipologia: string,
        public locali: number,
        public indirizzo: string,
        public zona: string,
        public comune: string,
        public prezzo: number,
        public riscaldamento: string,
        public classeEnergetica: string,
        public consumo: number,
        public contratto: string,
        public categoria: string,
        public stato: string,
        public libero: string,
        public status: string,
        public piano: string,
        public caratteristiche: Caratteristiche,
        public logs: Log[],
        public files: File[],
        public inquilini: Persona[]
    ) {}
}
