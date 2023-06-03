import { useNavigate } from "react-router-dom";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import LavoroForm from "../../../components/forms/lavoro-form/Lavoro-form";
import { useAppSelector } from "../../../hooks";
import { Lavoro } from "../../../entities/lavoro.model";

const LavoroFormPage = () => {
    const currentLavoro = useAppSelector((state) => state.lavoro.currentLavoro);

    const navigate = useNavigate();

    const backToList = () => navigate(-1);

    return (
        <>
            <FormTitle
                title={"Modifica Obiettivo"}
                handler={backToList}
                backToList
            />
            <LavoroForm
                lavoro={currentLavoro ? (currentLavoro as Lavoro) : null}
                backToList={backToList}
            />
        </>
    );
};

export default LavoroFormPage;
