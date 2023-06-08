import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormTitle from "../../components/form-components/form-title/FormTitle";
import { closeIonSelect } from "../../utils/closeIonSelect";
import FormVisit from "../../components/forms/visit-form/VisitForm";

const AppuntamentoFormPage = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const navigate = useNavigate();

    const backToList = () => navigate(-1);

    return (
        <>
            <FormTitle
                title={"Modifica Visita"}
                handler={backToList}
                backToList
            />
            <FormVisit operationComplete={backToList} />
        </>
    );
};

export default AppuntamentoFormPage;
