import { Caratteristiche } from "./caratteristiche.model";
import { Evento } from "./evento.model";
import { File } from "./file.model";
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
    | "files"
    | "lavori"
    | "logs"
    | "operazioni"
    | "persone"
    | "steps"
    | "users"
    | "visite";

export type Entity =
    | Caratteristiche
    | Immobile
    | Evento
    | File
    | Lavoro
    | Log
    | Operazione
    | Persona
    | Step
    | User
    | Visit;
