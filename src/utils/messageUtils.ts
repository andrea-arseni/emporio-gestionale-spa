import { Immobile } from "../entities/immobile.model";
import { Persona } from "../entities/persona.model";
import { Visit } from "../entities/visit.model";
import { userData } from "../store/auth-slice";
import { tipologia } from "../types/tipologia";
import { capitalize } from "./stringUtils";
import { getDayName } from "./timeUtils";

const getNome = (nome: string | null) =>
    !nome ? "" : " " + capitalize(nome.split(" ")[0]);

const getSaluto = () => {
    const ora = +new Date().toLocaleTimeString().split(":")[0];
    if (ora < 12) return "Buongiorno";
    if (ora < 16) return "Buon pomeriggio";
    return "Buonasera";
};

const getPresentazione = (nome: string | null, userData: userData) => {
    return `${getSaluto()}${getNome(nome)}, sono ${
        userData.name
    } dell'Emporio Case.`;
};

const getGiornoAppuntamento = (giornoAppuntamento: string, date: Date) => {
    const oggi = new Date();
    oggi.setHours(23, 59, 59, 59);
    date.setHours(0, 0, 0, 0);
    if (
        oggi.getDate() === date.getDate() &&
        oggi.getMonth() === date.getMonth() &&
        oggi.getFullYear() === date.getFullYear()
    )
        return "oggi";
    if (date.getTime() - oggi.getTime() < 1000 * 60 * 60 * 24) {
        return "domani";
    }
    return giornoAppuntamento;
};

const getDataAppuntamento = (quando: string) => {
    const date = new Date(quando);
    const partiGiornoAppuntamento = getDayName(date, "long").split(" ");
    partiGiornoAppuntamento.pop();
    const giornoAppuntamento = partiGiornoAppuntamento.join(" ");
    const tempoAppuntamento = quando.split("T")[1].substring(0, 5);
    return `Le confermo l'appuntamento di ${getGiornoAppuntamento(
        giornoAppuntamento,
        date
    )} alle ${tempoAppuntamento}`;
};

const getTipologia = (tipologia: tipologia) => {
    switch (tipologia) {
        case "appartamento":
            return "dell'appartamento";
        case "villa a schiera":
            return "della villa";
        case "villa bifamiliare":
            return "della villa";
        case "villa unifamiliare":
            return "della villa";
        default:
            return `del ${tipologia.toLowerCase()}`;
    }
};

const getImmobileAppuntamento = (immobile: Immobile | null) => {
    return !immobile
        ? ""
        : ` per la visita ${getTipologia(immobile.tipologia!)}`;
};

const getDove = (visita: Visit) => {
    if (visita.dove) return ` in ${visita.dove}.`;
    const immobile = visita.immobile;
    if (immobile && immobile.comune && immobile.indirizzo)
        return ` a ${immobile.comune} in ${immobile.indirizzo}.`;
    return `.`;
};

const chiusuraVisita = `Per qualsiasi comunicazione mi scriva pure qui. Grazie`;

export const getInterestMessage = (
    persona: Persona,
    immobile: Immobile,
    userData: userData
) => {
    return `${getPresentazione(
        persona.nome,
        userData
    )} Abbiamo ricevuto il suo interessamento in merito all'immobile che stiamo ${
        immobile.contratto === "affitto" ? "affittando" : "vendendo"
    } in ${immobile.indirizzo} a ${capitalize(
        immobile.comune!
    )}. Se volesse avere maggiori informazioni o prenotare una visita può rispondermi qui oppure scrivermi a ${
        userData.email
    }. Grazie`;
};

export const getConfermaVisitaMessage = (visita: Visit, userData: userData) => {
    return `${getPresentazione(
        visita.persona && visita.persona.nome,
        userData
    )} ${getDataAppuntamento(visita.quando!)}${getImmobileAppuntamento(
        visita.immobile
    )}${getDove(visita)} ${chiusuraVisita}`;
};
