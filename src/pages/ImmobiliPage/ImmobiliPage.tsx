import { useState } from "react";
import Selector from "../../components/selector/Selector";
import { Entity } from "../../entities/entity";

const ImmobiliPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [currentImmobile, setCurrentImmobile] = useState<Entity | null>(null);

    return (
        <div className="page">
            <Selector
                setMode={setMode}
                entitiesType="immobili"
                setCurrentEntity={setCurrentImmobile}
            />
        </div>
    );
};

export default ImmobiliPage;
