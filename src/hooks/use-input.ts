import { useState } from "react";

// the hook takes a validationFunction which gives a boolean taking an input of type number or string
const useInput = (
    validationFunction: (
        input: string | number,
        startingValue?: any
    ) => boolean,
    startingValue?: any
) => {
    const [inputValue, setInputValue] = useState(
        startingValue ? startingValue : ""
    );

    const [inputIsTouched, setInputIsTouched] = useState(false);

    const inputIsInvalid = !validationFunction(inputValue) && inputIsTouched;

    const [virginInput, setVirginInput] = useState<boolean>(false);

    const inputTouchedHandler = () => {
        inputValue.toString().length === 0
            ? setInputIsTouched(false)
            : virginInput
            ? setVirginInput(false)
            : setInputIsTouched(true);
    };

    const inputChangedHandler = (event: any, directValue?: string | null) => {
        setInputValue(!event ? directValue : event.target!.value);

        if (
            (!event && directValue === "") ||
            (event &&
                event.target &&
                event.target.value &&
                event.target.value.toString().trim() === "")
        ) {
            setInputIsTouched(false);
            setVirginInput(true);
        }
    };

    const reset = () => {
        setInputValue("");
        setInputIsTouched(false);
    };

    return {
        inputValue,
        inputIsInvalid,
        inputIsTouched,
        inputTouchedHandler,
        inputChangedHandler,
        reset,
    };
};

export default useInput;
