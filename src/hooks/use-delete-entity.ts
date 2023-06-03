import { useIonAlert } from "@ionic/react";
import { useAppDispatch } from "../hooks";
import useErrorHandler from "./use-error-handler";
import { changeLoading } from "../store/ui-slice";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const useDeleteEntity = () => {
    const navigate = useNavigate();

    const { errorHandler } = useErrorHandler();

    const dispatch = useAppDispatch();

    const [presentAlert] = useIonAlert();

    const deleteEntity = (entityName: string, id: string) => {
        presentAlert({
            header: "Attenzione!",
            subHeader: "La cancellazione è irreversibile. Sei sicuro?",
            buttons: [
                {
                    text: "Conferma",
                    handler: () => confirmDeleteEntity(entityName, id),
                },
                {
                    text: "Indietro",
                    role: "cancel",
                },
            ],
        });
    };

    const confirmDeleteEntity = async (entityName: string, id: string) => {
        dispatch(changeLoading(true));
        await new Promise((r) => setTimeout(r, 400));
        let url = entityName + "/" + id;
        try {
            await axiosInstance.delete(url);
            dispatch(changeLoading(false));
            navigate(-1);
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(e, "Eliminazione non riuscita");
        }
    };

    return { deleteEntity };
};

export default useDeleteEntity;
