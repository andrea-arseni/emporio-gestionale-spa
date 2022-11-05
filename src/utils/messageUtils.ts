import { Immobile } from "../entities/immobile.model";
import { Persona } from "../entities/persona.model";
import capitalize from "./capitalize";

export const getInterestMessage = (persona: Persona, immobile: Immobile) => {
    const userData = JSON.parse(localStorage.getItem("userData")!);
    return `Buongiorno ${
        !persona.nome
            ? ""
            : persona.nome
                  .split(" ")
                  .map((el) => capitalize(el))
                  .join(" ")
    }, sono ${
        userData.name
    } dell'Emporio Case. Abbiamo ricevuto il suo interessamento in merito all'immobile che stiamo ${
        immobile.contratto === "affitto" ? "affittando" : "vendendo"
    } in ${immobile.indirizzo} a ${capitalize(
        immobile.comune!
    )}. Se volesse avere maggiori informazioni o prenotare una visita può rispondermi qui oppure scrivermi a ${
        userData.email
    }. Grazie`;
};
