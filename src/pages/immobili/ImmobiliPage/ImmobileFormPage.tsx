import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import ImmobileForm from "../../../components/forms/immobile-form/ImmobileForm";
import { useEffect } from "react";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const ImmobileFormPage = () => {
    const currentImmobile = useAppSelector((state) => state.immobile.immobile);

    const navigate = useNavigate();

    const backToList = () => navigate(-1);

    useEffect(() => {
        closeIonSelect();
    }, []);

    return (
        <>
            <FormTitle
                title={"Modifica Immobile"}
                handler={backToList}
                backToList
            />
            <ImmobileForm
                immobile={currentImmobile ? currentImmobile : null}
                backToList={backToList}
            />
        </>
    );
};

export default ImmobileFormPage;
