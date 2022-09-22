import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Entity } from "../entities/entity";

const useSelection = (
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>
) => {
    const [entitySelected, setEntitySelected] = useState<number | null>(null);

    const [onFire, isOnFire] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            isOnFire(false);
        }, 300);
    }, [onFire]);

    const selectEntity = (entity: Entity) => {
        // check condition double click
        if (entitySelected === entity.id && onFire) setCurrentEntity(entity);
        // handle first click
        setEntitySelected(+entity.id!);
        isOnFire(true);
    };

    return { selectEntity, entitySelected };
};

export default useSelection;
