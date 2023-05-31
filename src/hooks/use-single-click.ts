import { useCallback, useEffect, useState } from "react";

const useSingleClick = () => {
    const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;

        if (hasBeenClicked) {
            timeout = setTimeout(() => {
                setHasBeenClicked(false);
            }, 400);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [hasBeenClicked]);

    const closeIonSelects = useCallback(
        (ionSelectList: React.RefObject<HTMLIonSelectElement>[]) => {
            ionSelectList.forEach((element) => {
                if (element) element.current?.close();
            });
        },
        []
    );

    const releaseFocus = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    const [isFocusOnTextArea, setIsFocusOnTextArea] = useState<boolean>(false);

    const activateTextAreaFocus = () => setIsFocusOnTextArea(true);

    const deactivateTextAreaFocus = () => setIsFocusOnTextArea(false);

    return {
        hasBeenClicked,
        setHasBeenClicked,
        closeIonSelects,
        releaseFocus,
        isFocusOnTextArea,
        activateTextAreaFocus,
        deactivateTextAreaFocus,
    };
};

export default useSingleClick;
