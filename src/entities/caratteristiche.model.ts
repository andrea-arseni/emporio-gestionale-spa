import { ariaCondizionata } from "../types/aria_condizionata";
import { arredamento } from "../types/arredamento";
import { balconi_terrazzi } from "../types/balconi_terrazzi";
import { box } from "../types/box";
import { categoriaCatastale } from "../types/categoria_catastale";
import { citofono } from "../types/citofono";
import { combustibile } from "../types/combustibile";
import { esposizione } from "../types/esposizione";
import { giardino } from "../types/giardino";
import { impianto } from "../types/impianto";
import { livelli } from "../types/livelli";
import { portineria } from "../types/portineria";
import { proprieta } from "../types/proprieta";
import { serramentiEsterni } from "../types/serramenti_esterni";
import { serramentiInterni } from "../types/serramenti_interni";

export class Caratteristiche {
    constructor(
        public id: number | null,
        public descrizione: string | null,
        public esposizione: esposizione | null,
        public speseCondominiali: number | null,
        public speseExtraNote: string | null,
        public ascensore: boolean | null,
        public arredamento: arredamento | null,
        public balconi: balconi_terrazzi | null,
        public terrazzi: balconi_terrazzi | null,
        public box: box | null,
        public giardino: giardino | null,
        public taverna: string | null,
        public mansarda: string | null,
        public cantina: string | null,
        public speseRiscaldamento: number | null,
        public ariaCondizionata: ariaCondizionata | null,
        public proprieta: proprieta | null,
        public categoriaCatastale: categoriaCatastale | null,
        public rendita: number | null,
        public impiantoElettrico: impianto | null,
        public impiantoIdraulico: impianto | null,
        public livelli: livelli | null,
        public serramentiInterni: serramentiInterni | null,
        public serramentiEsterni: serramentiEsterni | null,
        public portaBlindata: boolean | null,
        public antifurto: string | null,
        public citofono: citofono | null,
        public annoCostruzione: number | null,
        public portineria: portineria | null,
        public combustibile: combustibile | null,
        public cablato: string | null,
        public tipoContratto: string | null,
        public cauzione: string | null,
        public altezza: string | null,
        public totalePiani: number | null
    ) {}
}
