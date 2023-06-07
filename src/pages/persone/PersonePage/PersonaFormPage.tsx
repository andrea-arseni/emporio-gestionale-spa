import { useNavigate } from "react-router-dom";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import { Persona } from "../../../entities/persona.model";
import { useAppSelector } from "../../../hooks";
import PersoneForm from "../../../components/forms/persone-form/PersoneForm";
import { closeIonSelect } from "../../../utils/closeIonSelect";
import { useEffect } from "react";

const PersonaFormPage = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const currentPersona = useAppSelector((state) => state.persona.persona);

    const navigate = useNavigate();

    const backToList = () => navigate(-1);

    return (
        <>
            <FormTitle
                title={"Modifica Persona"}
                handler={backToList}
                backToList
            />
            <PersoneForm
                persona={currentPersona ? (currentPersona as Persona) : null}
                backToList={backToList}
            />
        </>
    );
};

export default PersonaFormPage;
