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
    week = completeWeek(referenceDay, week, "before");
    // push fino a giorno = 0
    week = completeWeek(referenceDay, week, "after");
    week.sort((a: Giorno, b: Giorno) => a.date.getTime() - b.date.getTime());
    return week;
};

const completeWeek = (
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

export const getCorrectDate = (input: Date) =>
    new Date(input.getTime() - input.getTimezoneOffset() * 60000);

export const getDayName = (
    input: Date,
    mode: "short" | "medium" | "long" | "week" = "short"
) => {
    input = getCorrectDate(input);
    let output = "";
    if (mode === "long")
        output = output + GIORNI_DELLA_SETTIMANA[input.getDay()] + " ";
    if (mode === "week")
        output =
            output +
            GIORNI_DELLA_SETTIMANA[input.getDay()].substring(0, 4) +
            ". ";
    return (
        output +
        `${input.getDate()}${
            mode === "short"
                ? `/${input.getMonth() + 1}/`
                : ` ${MONTH_OF_THE_YEAR[input.getMonth()]} `
        }${
            mode === "short" || mode === "week"
                ? input.getFullYear().toString().substring(2)
                : input.getFullYear()
        }`
    );
};

export const getTwoDigitString = (input: number) =>
    input < 10 ? "0" + input : input.toString();

export const getHours = (input: Date) => {
    input = getCorrectDate(input);
    return `${getTwoDigitString(input.getHours())}:${getTwoDigitString(
        input.getMinutes()
    )}`;
};

export const getDateAndTime = (input: string) =>
    `${getDayName(new Date(input), "long")} - ${getHours(new Date(input))}`;

export const getDateAsString = (input: Date) => {
    input = getCorrectDate(input);
    return `${input.getFullYear()}-${getTwoDigitString(
        input.getMonth() + 1
    )}-${getTwoDigitString(input.getDate())}`;
};

export const areDateEquals = (inputOne: Date, inputTwo: Date) =>
    getDateAsString(inputOne) === getDateAsString(inputTwo);

export const addDays = (input: Date, numberOfDays: number) => {
    const correctedDate = getCorrectDate(input);
    const output = new Date(
        correctedDate.getTime() + 1000 * 60 * 60 * 24 * numberOfDays
    );
    return output;
};

export const isNotSunday = (dateString: string) =>
    new Date(dateString).getDay() !== 0;

export const isPast = (input: Date) => input.getTime() < new Date().getTime();

export const getPossibleTimeValues = () => {
    const options: string[] = [];
    const minutes = ["00", "15", "30", "45"];
    for (let hours = 8; hours < 21; hours++) {
        minutes.forEach((min) =>
            options.push(`${getTwoDigitString(hours)}:${min}`)
        );
    }
    return options;
};
