import { golfOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import NewEntityBar from "../../../components/bars/new-entity-bar/NewEntityBar";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import LavoroForm from "../../../components/forms/lavoro-form/Lavoro-form";
import Selector from "../../../components/selector/Selector";
import { Entity } from "../../../entities/entity";
import { Lavoro } from "../../../entities/lavoro.model";
import { useAppDispatch } from "../../../hooks";
import { setCurrentLavoro } from "../../../store/lavori-slice";

const LavoriPage: React.FC<{}> = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentLavoro(null));
    }, [dispatch]);

    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentLavoro, setCurrentLocalLavoro] = useState<Entity | null>(
        null
    );

    const backToList = () => {
        setMode("list");
        setCurrentLocalLavoro(null);
    };

    return (
        <>
            {mode === "list" && (
                <>
                    <NewEntityBar
                        setMode={setMode}
                        icon={golfOutline}
                        title="Nuovo Obiettivo"
                    />
                    <Selector
                        setMode={setMode}
                        entitiesType="lavori"
                        setCurrentEntity={setCurrentLocalLavoro}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentLavoro?.id
                                ? "Modifica Obiettivo"
                                : "Nuovo Obiettivo"
                        }
                        handler={backToList}
                        backToList
                    />
                    <LavoroForm
                        lavoro={
                            currentLavoro ? (currentLavoro as Lavoro) : null
                        }
                        backToList={backToList}
                    />
                </>
            )}
        </>
    );
};

export default LavoriPage;
