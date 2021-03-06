import { Visit } from "../entities/visit.model";

export type GIORNO_DELLA_SETTIMANA =
    | "Domenica"
    | "Lunedì"
    | "Martedì"
    | "Mercoledì"
    | "Giovedì"
    | "Venerdì"
    | "Sabato";

export const GIORNI_DELLA_SETTIMANA: GIORNO_DELLA_SETTIMANA[] = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
];

const MONTH_OF_THE_YEAR = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];

export interface Giorno {
    giornoSettimana: GIORNO_DELLA_SETTIMANA;
    date: Date;
}

export const setWeek = (referenceDay: Date) => {
    // se il giorno è domenica considera il giorno precedente
    if (referenceDay.getDay() === 0)
        referenceDay = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    // dichiara settimana
    let week: Giorno[] = [];
    // compila il primo giorno
    const today: Giorno = {
        giornoSettimana: GIORNI_DELLA_SETTIMANA[referenceDay.getDay()],
        date: referenceDay,
    };
    week.push(today);
    // unshift fino a giorno = 1
    week = addDays(referenceDay, week, "before");
    // push fino a giorno = 0
    week = addDays(referenceDay, week, "after");
    week.sort((a: Giorno, b: Giorno) => a.date.getTime() - b.date.getTime());
    return week;
};

const addDays = (
    referenceDay: Date,
    week: Giorno[],
    mode: "before" | "after"
) => {
    let currentDay = new Date(referenceDay);
    while (
        mode === "before" ? currentDay.getDay() > 1 : currentDay.getDay() < 6
    ) {
        const offset =
            mode === "before" ? -1000 * 60 * 60 * 24 : +1000 * 60 * 60 * 24;
        currentDay = new Date(currentDay.getTime() + offset);
        const day: Giorno = {
            giornoSettimana: GIORNI_DELLA_SETTIMANA[currentDay.getDay()],
            date: currentDay,
        };
        week.push(day);
    }
    return week;
};

export const getDayName = (input: Date, mode: "short" | "long" = "short") => {
    let output = "";
    if (mode === "long")
        output = output + GIORNI_DELLA_SETTIMANA[input.getDay()] + " ";
    return (
        output +
        `${input.getDate()}${
            mode === "short"
                ? `/${input.getMonth() + 1}/`
                : ` ${MONTH_OF_THE_YEAR[input.getMonth()]} `
        }${input.getFullYear()}`
    );
};

export const getTwoDigitString = (input: number) =>
    input < 10 ? "0" + input : input.toString();

export const getDateAsString = (input: Date) =>
    `${input.getFullYear()}-${getTwoDigitString(
        input.getMonth() + 1
    )}-${getTwoDigitString(input.getDate())}`;

export const areDateEquals = (inputOne: Date, inputTwo: Date) =>
    getDateAsString(inputOne) === getDateAsString(inputTwo);
