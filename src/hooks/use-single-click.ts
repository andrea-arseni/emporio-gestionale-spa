import { useEffect, useState } from "react";

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

    return { hasBeenClicked, setHasBeenClicked };
};

export default useSingleClick;
