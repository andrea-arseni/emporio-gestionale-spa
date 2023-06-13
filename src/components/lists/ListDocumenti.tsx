import { Documento } from "../../entities/documento.model";
import { useAppDispatch } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import { setCurrentDocumento } from "../../store/documenti-slice";
import { useNavigate } from "react-router-dom";
import useUpAndDown from "../../hooks/use-up-and-down";
import React from "react";
import DocumentoItem from "../documento/DocumentoItem";
import useNavigateToItem from "../../hooks/use-navigate-to-item";

const ListDocumenti: React.FC<{
    documenti: Documento[];
    ref?: any;
    blockUpAndDown?: boolean;
}> = React.forwardRef((props, ref: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentDocumento(null));
    }, [dispatch]);

    const navigate = useNavigate();

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(
        props.documenti,
        selected,
        defineSelected,
        ref,
        props.blockUpAndDown
    );

    const selectItem = useCallback(
        (id: number) => {
            dispatch(
                setCurrentDocumento(
                    props.documenti.filter((el) => el.id === id)[0]
                )
            );
            navigate(`${id.toString()}`);
        },
        [dispatch, navigate, props.documenti]
    );

    useNavigateToItem(selected, selectItem);

    const handleClick = (id: number) => {
        if (selected !== id) {
            setSelected(id);
            return;
        }
        selectItem(id);
    };

    return (
        <>
            {props.documenti.map((documento: Documento) => (
                <DocumentoItem
                    key={documento.id}
                    documento={documento}
                    selected={selected}
                    handleClick={handleClick}
                />
            ))}
        </>
    );
});

export default ListDocumenti;
