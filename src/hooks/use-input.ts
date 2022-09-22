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
        virginInput ? setVirginInput(false) : setInputIsTouched(true);
    };

    const inputChangedHandler = (event: any) =>
        setInputValue(event.target!.value);

    const reset = () => {
        setInputValue("");
        setInputIsTouched(false);
        setVirginInput(true);
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
