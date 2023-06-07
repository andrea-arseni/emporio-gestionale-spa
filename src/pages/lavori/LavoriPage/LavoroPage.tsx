import { IonButton, IonIcon } from "@ionic/react";
import {
    backspaceOutline,
    createOutline,
    newspaperOutline,
    trashBinOutline,
} from "ionicons/icons";
import { useAppSelector } from "../../../hooks";
import { getStatusText } from "../../../utils/statusHandler";
import { capitalize } from "../../../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import { isUserAdmin } from "../../../utils/userUtils";
import useDeleteEntity from "../../../hooks/use-delete-entity";
import SinglePageData from "../../../components/single-page-component/SinglePageData";
import useWindowSize from "../../../hooks/use-size";
import { getDayName } from "../../../utils/timeUtils";
import { useEffect } from "react";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const LavoroPage: React.FC<{}> = () => {
    useEffect(() => {
        closeIonSelect();
    }, []);

    const navigate = useNavigate();

    const lavoro = useAppSelector((state) => state.lavoro.currentLavoro);

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => navigate(-1);

    const openHistory = () => navigate(`storia`);

    const openForm = () => navigate(`modifica`);

    const { deleteEntity } = useDeleteEntity();

    const [width] = useWindowSize();

    return (
        <div className="singlePageFrame">
            <div className="singlePageInnerFrame">
                <SinglePageData chiave="Titolo">
                    {lavoro?.titolo}
                </SinglePageData>
                <SinglePageData chiave="Status">
                    {capitalize(getStatusText(lavoro?.status!))}
                </SinglePageData>
                {lavoro?.data && (
                    <SinglePageData chiave="Ultimo aggiornamento">
                        {getDayName(
                            new Date(lavoro.data),
                            width > 500 ? "long" : "short"
                        )}
                    </SinglePageData>
                )}

                <br />
                <br />
                <IonButton
                    className="singlePageGeneralButton"
                    color="secondary"
                    mode="ios"
                    fill="solid"
                    onClick={openForm}
                >
                    <IonIcon className="rightSpace" icon={createOutline} />
                    Modifica titolo e/o status
                </IonButton>
                <IonButton
                    className="singlePageGeneralButton"
                    color="tertiary"
                    mode="ios"
                    fill="solid"
                    onClick={openHistory}
                >
                    <IonIcon className="rightSpace" icon={newspaperOutline} />
                    Apri la storia
                </IonButton>
                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        mode="ios"
                        fill="solid"
                        onClick={() =>
                            deleteEntity(`lavori`, lavoro?.id?.toString()!)
                        }
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella lavoro
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="medium"
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

export default LavoroPage;
