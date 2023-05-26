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

    return { hasBeenClicked, setHasBeenClicked, closeIonSelects };
};

export default useSingleClick;
