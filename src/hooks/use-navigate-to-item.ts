import { useEffect } from "react";

const useNavigateToItem = (
    selected: number,
    selectItem: (id: number) => void
) => {
    useEffect(() => {
        const navigateToItem = async (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (selected === 0) return;
                selectItem(selected);
            }
        };

        window.addEventListener("keydown", navigateToItem);
        return () => {
            window.removeEventListener("keydown", navigateToItem);
        };
    }, [selected, selectItem]);
};

export default useNavigateToItem;
