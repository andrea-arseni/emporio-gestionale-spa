import { useState } from "react";

// the hook takes a validationFunction which gives a boolean taking an input of type number or string
const useInput = (validationFunction: (input: string | number) => boolean) => {
    // the value of the input
    const [inputValue, setInputValue] = useState("");
    // if the input has been touched
    const [inputIsTouched, setInputIsTouched] = useState(false);
    // you set invalid only if the input has been touched but it is still invalid
    const inputIsInvalid = !validationFunction(inputValue) && inputIsTouched;

    const inputTouchedHandler = () => setInputIsTouched(true);
    const inputChangedHandler = (event: any) =>
        setInputValue(event.target!.value);
    const reset = () => {
        setInputValue("");
        setInputIsTouched(false);
    };
    return {
        inputValue,
        inputIsInvalid,
        inputTouchedHandler,
        inputChangedHandler,
        reset,
    };
};

export default useInput;
