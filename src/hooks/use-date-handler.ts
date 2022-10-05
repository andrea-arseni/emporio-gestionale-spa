import { useEffect, useState } from "react";
import useInput from "./use-input";

const useDateHandler = (
    validationFunction: (
        input: string | number,
        startingValue?: any
    ) => boolean,
    startingValue?: any
) => {
    const [datePickerIsOpen, setDatePickerIsOpen] = useState<boolean>(false);

    const {
        inputValue: inputDateValue,
        inputChangedHandler: inputDateChangedHandler,
        reset: inputDateReset,
    } = useInput(validationFunction, startingValue);

    useEffect(() => {
        setDatePickerIsOpen(false);
    }, [inputDateValue]);

    return {
        datePickerIsOpen,
        setDatePickerIsOpen,
        inputDateValue,
        inputDateChangedHandler,
        inputDateReset,
    };
};

export default useDateHandler;
