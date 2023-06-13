import { useEffect } from "react";
import { Entity } from "../entities/entity";

const useUpAndDown = (
    list: Entity[],
    selected: number,
    setSelected: (newId: number) => void,
    refList?: React.MutableRefObject<any>,
    blockUpAndDown?: boolean
) => {
    useEffect(() => {
        const changeSelectedItem = async (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                if (selected === 0) {
                    setSelected(+list[0].id!);
                } else {
                    let index = list.findIndex((el) => el.id === selected);
                    if (index === list.length - 1) return;
                    const nextEntity = list[++index];
                    setSelected(+nextEntity.id!);
                    refList?.current.scrollBy({
                        top: 76,
                        behavior: "smooth",
                    });
                }
            }
            if (e.key === "ArrowUp") {
                if (selected === 0) {
                    setSelected(+list[0].id!);
                } else {
                    let index = list.findIndex((el) => el.id === selected);
                    if (index === 0) return;
                    const nextEntity = list[--index];
                    setSelected(+nextEntity.id!);
                    refList?.current.scrollBy({
                        top: -76,
                        behavior: "smooth",
                    });
                }
            }
        };

        if (!blockUpAndDown)
            window.addEventListener("keydown", changeSelectedItem);
        return () => {
            window.removeEventListener("keydown", changeSelectedItem);
        };
    }, [list, selected, setSelected, refList, blockUpAndDown]);
};

export default useUpAndDown;
