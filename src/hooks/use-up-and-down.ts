import { useEffect } from "react";
import { Entity } from "../entities/entity";

const useUpAndDown = (
    list: Entity[],
    selected: number,
    setSelected: (newId: number) => void,
    refList?: React.MutableRefObject<any>
) => {
    useEffect(() => {
        const changeSelectedItem = async (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" && selected !== 0) {
                let index = list.findIndex((el) => el.id === selected);
                if (index === list.length) return;
                const nextEntity = list[++index];
                setSelected(+nextEntity.id!);
                refList?.current.scrollBy({
                    top: 200,
                    behavior: "smooth",
                });
            }
            if (e.key === "ArrowUp" && selected !== 0) {
                let index = list.findIndex((el) => el.id === selected);
                if (index === 0) return;
                const nextEntity = list[--index];
                setSelected(+nextEntity.id!);
                refList?.current.scrollBy({
                    top: 200,
                    behavior: "smooth",
                });
            }
        };

        window.addEventListener("keydown", changeSelectedItem);
        return () => {
            window.removeEventListener("keydown", changeSelectedItem);
        };
    }, [list, selected, setSelected, refList]);
};

export default useUpAndDown;
