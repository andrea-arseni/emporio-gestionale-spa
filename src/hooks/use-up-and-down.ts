import { useEffect } from "react";
import { Entity } from "../entities/entity";

const useUpAndDown = (
    list: Entity[],
    selected: number,
    setSelected: (newId: number) => void
) => {
    useEffect(() => {
        const changeSelectedItem = async (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" && selected !== 0) {
                let index = list.findIndex((el) => el.id === selected);
                if (index === list.length) return;
                const nextEntity = list[++index];
                setSelected(+nextEntity.id!);
            }
            if (e.key === "ArrowUp" && selected !== 0) {
                let index = list.findIndex((el) => el.id === selected);
                if (index === 0) return;
                const nextEntity = list[--index];
                setSelected(+nextEntity.id!);
            }
        };

        window.addEventListener("keydown", changeSelectedItem);
        return () => {
            window.removeEventListener("keydown", changeSelectedItem);
        };
    }, [list, selected, setSelected]);
};

export default useUpAndDown;
