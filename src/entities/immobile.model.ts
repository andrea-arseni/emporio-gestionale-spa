import { categoria } from "../types/categoria";
import { classeEnergetica } from "../types/classeEnergetica";
import { contratto } from "../types/contratto";
import { libero } from "../types/libero";
import { locali } from "../types/locali";
import { piano } from "../types/piano";
import { riscaldamento } from "../types/riscaldamento";
import { stato } from "../types/stato";
import { status } from "../types/status";
import { tipologia } from "../types/tipologia";
import { Caratteristiche } from "./caratteristiche.model";
import { Documento } from "./documento.model";
import { Log } from "./log.model";
import { Persona } from "./persona.model";

export class Immobile {
    constructor(
        public id: number | null,
        public ref: number | null,
        public titolo: string | null,
        public superficie: number | null,
        public proprietario: Persona | null,
        public tipologia: tipologia | null,
        public locali: locali | null,
        public indirizzo: string | null,
        public zona: string | null,
        public comune: string | null,
        public prezzo: number | null,
        public riscaldamento: riscaldamento | null,
        public classeEnergetica: classeEnergetica | null,
        public consumo: number | null,
        public contratto: contratto | null,
        public categoria: categoria | null,
        public stato: stato | null,
        public libero: libero | null,
        public status: status | null,
        public piano: piano | null,
        public caratteristiche: Caratteristiche | null,
        public logs: Log[] | null,
        public files: Documento[] | null,
        public inquilini: Persona[] | null
    ) {}
}
