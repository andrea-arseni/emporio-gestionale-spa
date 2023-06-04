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

const LavoroPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const lavoro = useAppSelector((state) => state.lavoro.currentLavoro);

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => navigate(-1);

    const openHistory = () => navigate(`storia`);

    const openForm = () => navigate(`modifica`);

    const { deleteEntity } = useDeleteEntity();

    return (
        <div className="singlePageFrame">
            <div className="singlePageInnerFrame">
                <h4 className="singlePageTitolo">Titolo:</h4>
                <h4> {lavoro?.titolo}</h4>
                <h4 className="singlePageTitolo">Status: </h4>
                <h4>{capitalize(getStatusText(lavoro?.status!))}</h4>
                <p className="singlePageTitolo">Ultimo aggiornamento:</p>
                <p> {lavoro?.data}</p>
                <br />
                <br />
                <IonButton
                    className="singlePageGeneralButton"
                    color="secondary"
                    expand="full"
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
                    expand="full"
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
                        expand="full"
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

export default LavoroPage;
