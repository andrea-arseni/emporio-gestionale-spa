import { IonItem, IonLabel } from "@ionic/react";
import { Step } from "../../entities/step.model";
import { useAppDispatch } from "../../hooks";
import { getDateAndTime } from "../../utils/timeUtils";
import { useCallback, useEffect, useState } from "react";
import { setCurrentStep } from "../../store/steps-slice";
import { useNavigate } from "react-router-dom";
import useUpAndDown from "../../hooks/use-up-and-down";
import useNavigateToItem from "../../hooks/use-navigate-to-item";
import React from "react";

const ListSteps: React.FC<{
    steps: Step[];
    ref?: any;
}> = React.forwardRef((props, ref: any) => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setCurrentStep(null));
    }, [dispatch]);

    const [selected, setSelected] = useState<number>(0);

    const defineSelected = useCallback(
        (newId: number) => setSelected(newId),
        []
    );

    useUpAndDown(props.steps, selected, defineSelected, ref);

    const handleClick = (id: number) => {
        if (selected === id) {
            dispatch(
                setCurrentStep(props.steps.filter((el) => el.id === id)[0])
            );
            navigate(`${id}`);
        } else {
            setSelected(id);
        }
    };

    const selectItem = useCallback(
        (id: number) => {
            dispatch(
                setCurrentStep(props.steps.filter((el) => el.id === id)[0])
            );
            navigate(`${id.toString()}`);
        },
        [dispatch, navigate, props.steps]
    );

    useNavigateToItem(selected, selectItem);

    const getDescrizione = (step: Step) => {
        if (step.descrizione && step.descrizione.includes("***")) {
            const primaParte = step.descrizione.split("***")[0].trim();
            const secondaParte = step.descrizione.split("***")[1].trim();
            return (
                <>
                    <p style={{ color: "#3880ff" }}>{primaParte}</p>
                    <h2>{secondaParte}</h2>
                </>
            );
        }
        return <h2>{step.descrizione}</h2>;
    };

    return (
        <>
            {props.steps.map((step: Step) => {
                return (
                    <IonItem
                        onClick={() => handleClick(step.id!)}
                        key={step.id!}
                        color={step.id === selected ? "primary" : "light"}
                    >
                        <IonLabel
                            color={step.id === selected ? "light" : "dark"}
                            text-wrap
                        >
                            <p>{getDateAndTime(step.data!)}</p>
                            {getDescrizione(step)}
                            <p>{step.user?.name}</p>
                        </IonLabel>
                    </IonItem>
                );
            })}
        </>
    );
});

export default ListSteps;
