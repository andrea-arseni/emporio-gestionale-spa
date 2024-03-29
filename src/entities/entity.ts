import { Caratteristiche } from "./caratteristiche.model";
import { Documento } from "./documento.model";
import { Evento } from "./evento.model";
import { Immobile } from "./immobile.model";
import { Lavoro } from "./lavoro.model";
import { Log } from "./log.model";
import { Operazione } from "./operazione.model";
import { Persona } from "./persona.model";
import { Step } from "./step.model";
import { User } from "./user.model";
import { Visit } from "./visit.model";

export type entitiesType =
    | "caratteristiche"
    | "immobili"
    | "eventi"
    | "lavori"
    | "logs"
    | "operazioni"
    | "persone"
    | "steps"
    | "users"
    | "visite"
    | "documenti";

export type Entity =
    | Caratteristiche
    | Immobile
    | Evento
    | Lavoro
    | Log
    | Operazione
    | Persona
    | Step
    | User
    | Visit
    | Documento;
