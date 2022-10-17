export const numberAsPrice = (input: number) => {
    let numberAsString = input.toString().trim();
    let invertedString = "";
    let minus = false;
    if (numberAsString.startsWith("-")) {
        minus = true;
        numberAsString = numberAsString.substring(1);
    }
    let counter = 0;
    for (let i = numberAsString.length - 1; i >= 0; i--) {
        counter++;
        if (numberAsString[i] === "-") continue;
        if (numberAsString[i] === ".") {
            invertedString = invertedString + ",";
            continue;
        }
        invertedString = invertedString + numberAsString[i];
        if (counter % 3 === 0 && i !== 0) invertedString = invertedString + ".";
    }
    let output = "";
    for (let i = invertedString.length - 1; i >= 0; i--) {
        output = output + invertedString[i];
    }
    return (minus ? "-" : "") + output + " €";
};

export const getPhoneValue = (input: string | null | undefined) => {
    if (!input || input.trim().length === 0) return null;
    let phoneValue: string = input
        .trim()
        .split(" ")
        .join("")
        .split("/")
        .join("");
    return phoneValue.length > 0 ? phoneValue : null;
};
