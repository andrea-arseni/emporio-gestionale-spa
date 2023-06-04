import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import useDeleteEntity from "../../../hooks/use-delete-entity";
import { IonButton, IonIcon, IonLoading, useIonAlert } from "@ionic/react";
import {
    createOutline,
    newspaperOutline,
    trashBinOutline,
    backspaceOutline,
    folderOutline,
    trendingDownOutline,
    personAddOutline,
} from "ionicons/icons";
import { getStatusText } from "../../../utils/statusHandler";
import { capitalize } from "../../../utils/stringUtils";
import { isUserAdmin } from "../../../utils/userUtils";
import useWindowSize from "../../../hooks/use-size";
import SinglePageData from "../../../components/single-page-component/SinglePageData";
import { getDayName } from "../../../utils/timeUtils";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import useErrorHandler from "../../../hooks/use-error-handler";
import { isNativeApp, saveContact } from "../../../utils/contactUtils";

const PersonaPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const [showLoading, setShowLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setShowLoading(false);
        }, 1000);
    }, []);

    const persona = useAppSelector((state) => state.persona.persona);

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => navigate(-1);

    const openHistory = () => navigate(`storia`);

    const openFiles = () => navigate(`files`);

    const openForm = () => navigate(`modifica`);

    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const addPersonaToRubrica = () =>
        saveContact(presentAlert, persona!, errorHandler);

    const disattivaPersona = async (id: number) => {
        // loading
        setShowLoading(true);
        try {
            // query di update
            await axiosInstance.patch(`persone/${id}`, {
                status: "D_DISATTIVA",
            });
            setShowLoading(false);
            navigate(-1);
        } catch (e) {
            setShowLoading(false);
            // error handling
            errorHandler(e, "Disattivazione non riuscita");
        }
    };

    const { deleteEntity } = useDeleteEntity();

    const [width] = useWindowSize();

    return (
        <div className="singlePageFrame">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="singlePageInnerFrame">
                <SinglePageData chiave="Nome">
                    {persona?.nome
                        ?.split(" ")
                        .map((el) => capitalize(el))
                        .join(" ")}
                </SinglePageData>
                <SinglePageData chiave="Status">
                    {capitalize(getStatusText(persona?.status!))}
                </SinglePageData>
                <SinglePageData chiave="Telefono">
                    {persona?.telefono && (
                        <a href={`tel:${persona.telefono}`}>
                            {persona.telefono}
                        </a>
                    )}
                    {!persona?.telefono && "Non presente"}
                </SinglePageData>
                <SinglePageData chiave="Email">
                    {persona?.email && (
                        <a href={`mailto:${persona.email}`}>
                            {width >= 450 ? persona.email : "Email"}
                        </a>
                    )}
                    {!persona?.email && "Non presente"}
                </SinglePageData>
                <SinglePageData chiave="Ruolo">
                    {persona?.ruolo ? persona.ruolo : "Non presente"}
                </SinglePageData>
                {persona?.data && (
                    <SinglePageData chiave="Ultimo contatto">
                        {getDayName(
                            new Date(persona.data),
                            width > 500 ? "long" : "short"
                        )}
                    </SinglePageData>
                )}
                <br />
                <br />
                {isNativeApp && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="primary"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        onClick={addPersonaToRubrica}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={personAddOutline}
                        />
                        Aggiungi a rubrica telefono
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="secondary"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    onClick={openForm}
                >
                    <IonIcon className="rightSpace" icon={createOutline} />
                    Modifica i dati
                </IonButton>
                <IonButton
                    className="singlePageGeneralButton"
                    color="tertiary"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    onClick={openHistory}
                >
                    <IonIcon className="rightSpace" icon={newspaperOutline} />
                    Apri la storia
                </IonButton>
                <IonButton
                    className="singlePageGeneralButton"
                    color="success"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    onClick={openFiles}
                >
                    <IonIcon className="rightSpace" icon={folderOutline} />
                    Apri i file
                </IonButton>
                {persona!.status?.toUpperCase() !== "D_DISATTIVA" && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="dark"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        onClick={() => disattivaPersona(persona!.id!)}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trendingDownOutline}
                        />
                        Disattiva
                    </IonButton>
                )}
                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        onClick={() =>
                            deleteEntity(`persone`, persona?.id?.toString()!)
                        }
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella Persona
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="medium"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    onClick={navigateBack}
                >
                    <IonIcon className="rightSpace" icon={backspaceOutline} />
                    Torna Indietro
                </IonButton>
            </div>
        </div>
    );
};

export default PersonaPage;
