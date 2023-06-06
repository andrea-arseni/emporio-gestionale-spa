import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
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
import { setPersona } from "../../../store/persona-slice";
import { Immobile } from "../../../entities/immobile.model";
import SinglePageItem from "../../../components/single-page-component/SinglePageItem";
import { Evento } from "../../../entities/evento.model";

const PersonaPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const [clickBlocked, setClickBlocked] = useState<boolean>(true);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const persona = useAppSelector((state) => state.persona.persona);

    const [immobileInteresse, setImmobileInteresse] = useState<Immobile | null>(
        null
    );

    useEffect(() => {
        const sortEventsByDate = (events: Evento[]) =>
            events.sort(
                (a, b) =>
                    new Date(b.data!).getTime() - new Date(a.data!).getTime()
            );

        const getLastInterestedHouseEvent = (events: Evento[]) =>
            events.find((el) => el.immobile);

        const updatePersona = async () => {
            try {
                const res = await axiosInstance.get(`/persone/${persona?.id}`);
                dispatch(setPersona(res.data));
                const eventi = [...res.data.eventi];
                sortEventsByDate(eventi);
                const lastInterestedHouseEvent =
                    getLastInterestedHouseEvent(eventi);
                const lastInterestedHouse = lastInterestedHouseEvent
                    ? lastInterestedHouseEvent.immobile
                    : null;
                if (lastInterestedHouse)
                    setImmobileInteresse(lastInterestedHouse);
            } catch (e) {
                errorHandler(
                    e,
                    "Impossibile recuperare tutti i dati della persona, presente scheda solo parziale"
                );
            }
        };

        updatePersona();
    }, [persona?.id, dispatch, errorHandler]);

    useEffect(() => {
        setTimeout(() => {
            setClickBlocked(false);
        }, 1000);
    }, []);

    const userData = useAppSelector((state) => state.auth.userData);

    const navigateBack = () => {
        if (clickBlocked) return;
        navigate(-1);
    };

    const openHistory = () => {
        if (clickBlocked) return;
        navigate(`storia`);
    };

    const openFiles = () => {
        if (clickBlocked) return;
        navigate(`files`);
    };

    const openForm = () => {
        if (clickBlocked) return;
        navigate(`modifica`);
    };

    const addPersonaToRubrica = () => {
        if (clickBlocked) return;
        saveContact(presentAlert, persona!, errorHandler);
    };

    const disattivaPersona = async (id: number) => {
        if (clickBlocked) return;
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
                {persona?.status && (
                    <SinglePageData chiave="Status">
                        {capitalize(getStatusText(persona?.status!))}
                    </SinglePageData>
                )}
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
                {persona?.ruolo && (
                    <SinglePageData chiave="Ruolo">
                        {persona?.ruolo ? persona.ruolo : "Non presente"}
                    </SinglePageData>
                )}
                {persona?.data && (
                    <SinglePageData chiave="Ultimo contatto">
                        {getDayName(
                            new Date(persona.data),
                            width > 500 ? "long" : "short"
                        )}
                    </SinglePageData>
                )}
                {immobileInteresse && (
                    <SinglePageItem
                        titolo={`Interessato a un immobile`}
                        type="immobili"
                        entities={[immobileInteresse]}
                    />
                )}
                {persona?.immobili && persona.immobili.length > 0 && (
                    <SinglePageItem
                        titolo={`Proprietario di ${
                            persona.immobili.length
                        } immobil${persona.immobili.length === 1 ? "e" : "i"}`}
                        type="immobili"
                        entities={(persona.immobili as Immobile[])
                            .map((el) => el)
                            .sort((a, b) => a.ref! - b.ref!)}
                    />
                )}
                {persona?.immobileInquilino && (
                    <SinglePageItem
                        titolo={`Conduttore`}
                        type="immobili"
                        entities={[persona.immobileInquilino] as Immobile[]}
                    />
                )}
                <br />
                <br />
                {isNativeApp && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="primary"
                        mode="ios"
                        fill="solid"
                        onClick={addPersonaToRubrica}
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={personAddOutline}
                        />
                        Aggiungi a rubrica
                    </IonButton>
                )}
                <IonButton
                    className="singlePageGeneralButton"
                    color="secondary"
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
