import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useDeleteEntity from "../../../hooks/use-delete-entity";
import styles from "../Immobile/Immobile.module.css";
import {
    IonButton,
    IonIcon,
    IonLoading,
    IonSpinner,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    newspaperOutline,
    trashBinOutline,
    backspaceOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";
import { isUserAdmin } from "../../../utils/userUtils";
import { useEffect, useState } from "react";
import useErrorHandler from "../../../hooks/use-error-handler";
import SinglePageItem from "../../../components/single-page-component/SinglePageItem";
import { fetchImmobileById } from "../../../store/immobile-thunk";
import { Persona } from "../../../entities/persona.model";
import { ReactComponent as EuroIcon } from "../../../assets/icons/euro.svg";
import { ReactComponent as SquareMetersIcon } from "../../../assets/icons/planimetry.svg";
import { ReactComponent as HomeIcon } from "../../../assets/icons/house.svg";
import {
    addLocali,
    getCaratteristicheDefault,
    popolaCaratteristiche,
} from "../../../utils/immobileUtils";
import FeaturesWrapper from "../../../components/features-wrapper/FeaturesWrapper";
import { capitalize, stringifyNumber } from "../../../utils/stringUtils";
import axiosInstance from "../../../utils/axiosInstance";
import {
    setImmobile,
    setImmobileStoriaType,
} from "../../../store/immobile-slice";
import { closeIonSelect } from "../../../utils/closeIonSelect";

const ImmobilePage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    useEffect(() => {
        closeIonSelect();
        dispatch(setImmobileStoriaType("eventi"));
    }, [dispatch]);

    const [clickBlocked, setClickBlocked] = useState<boolean>(true);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const id = immobile?.id;

    useEffect(() => {
        dispatch(fetchImmobileById(id!));
    }, [dispatch, id]);

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

    const { deleteEntity } = useDeleteEntity();

    const copyImmobile = async () => {
        // loader
        setShowLoading(true);
        // axios call
        try {
            const res = await axiosInstance.post(
                `/immobili/${immobile!.id}/duplicate`
            );
            setShowLoading(false);
            // alert with go to new immobile or go to list
            presentAlert({
                header: "Ottimo",
                subHeader: `Immobile duplicato con successo!`,
                message: `Riferimento nuovo immobile: ${res.data.ref}`,
                buttons: [
                    {
                        text: "Vai al nuovo immobile",
                        handler: async () => {
                            dispatch(setImmobile(res.data));
                        },
                    },
                    {
                        text: "Chiudi",
                        role: "cancel",
                    },
                ],
            });
            // catch error
        } catch (e) {
            setShowLoading(false);
            errorHandler(e, "Duplicazione dell'immobile non riuscita");
        }
    };

    let caratteristiche = getCaratteristicheDefault();

    if (immobile)
        caratteristiche = popolaCaratteristiche(immobile, caratteristiche);

    const testoACapo = (text: string) => {
        const res = text.split("\n");
        return (
            <div>
                {res.map((el, index) =>
                    el ? (
                        <span key={el}>{el}</span>
                    ) : (
                        <div key={index}>
                            <br />
                        </div>
                    )
                )}
            </div>
        );
    };

    const elaborateDescrizione = (descrizione: string) => {
        if (!descrizione) return "";
        if (!descrizione.includes("href")) return testoACapo(descrizione);
        const link = descrizione.split("href='")[1].split("'")[0];
        const primaParte = descrizione.split("<a")[0];
        const secondaParte = descrizione.split("</a>")[1];
        return (
            <div>
                {testoACapo(primaParte)}
                <a href={link} rel="noreferrer" target={"_blank"}>
                    {link}
                </a>
                {testoACapo(secondaParte)}
            </div>
        );
    };

    return (
        <div className="singlePageFrame">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <div className="singlePageInnerFrame">
                {immobile && (
                    <h3 className={`centered ${styles.title}`}>
                        <span className={styles.ref}>{immobile?.ref}</span>
                        {immobile?.titolo}
                    </h3>
                )}
                {immobile && (
                    <div className={styles.mainData}>
                        <div>
                            <EuroIcon />
                            {stringifyNumber(immobile.prezzo!)}
                            {immobile.contratto === "affitto" ? " al mese" : ""}
                        </div>
                        <div>
                            <HomeIcon />{" "}
                            {capitalize(
                                immobile.tipologia ? immobile.tipologia : ""
                            )}
                            {addLocali(immobile)}
                        </div>
                        <div>
                            <SquareMetersIcon className={styles.icon} />{" "}
                            {immobile.superficie} m²
                        </div>
                    </div>
                )}
                {immobile && (
                    <FeaturesWrapper
                        title="Caratteristiche Principali"
                        features={caratteristiche.principali}
                    />
                )}
                {immobile && !immobile.caratteristiche && (
                    <IonSpinner color="primary" style={{ margin: "40px" }} />
                )}
                {immobile &&
                    immobile.caratteristiche &&
                    immobile.caratteristiche.descrizione && (
                        <FeaturesWrapper title="Descrizione">
                            <div className={styles.descrizione}>
                                {elaborateDescrizione(
                                    immobile.caratteristiche.descrizione
                                )}
                            </div>
                        </FeaturesWrapper>
                    )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Efficienza Energetica e Riscaldamento"
                        features={caratteristiche.efficienzaEnergetica}
                    />
                )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Caratteristiche Edificio"
                        features={caratteristiche.costruzione}
                    />
                )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Caratteristiche Specifiche"
                        features={caratteristiche.specifiche}
                    />
                )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Caratteristiche Serramenti"
                        features={caratteristiche.serramenti}
                    />
                )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Caratteristiche Impianti"
                        features={caratteristiche.impianti}
                    />
                )}
                {immobile && immobile.caratteristiche && (
                    <FeaturesWrapper
                        title="Categoria catastale e spese Previste"
                        features={caratteristiche.spese}
                    />
                )}
                {immobile &&
                    immobile.caratteristiche &&
                    immobile.contratto === "affitto" && (
                        <FeaturesWrapper
                            title="Caratteristiche Locazione"
                            features={caratteristiche.locazione}
                        ></FeaturesWrapper>
                    )}
                {immobile &&
                    immobile.caratteristiche &&
                    immobile.caratteristiche.notePrivate && (
                        <FeaturesWrapper title="Note Private">
                            <div className={styles.descrizione}>
                                {elaborateDescrizione(
                                    immobile.caratteristiche.notePrivate
                                )}
                            </div>
                        </FeaturesWrapper>
                    )}
                {immobile?.proprietario && (
                    <SinglePageItem
                        titolo={`Proprietario`}
                        type="persone"
                        entities={[immobile.proprietario] as Persona[]}
                    />
                )}
                {immobile?.inquilini && immobile.inquilini.length > 0 && (
                    <SinglePageItem
                        titolo={`${immobile?.inquilini.length} inquilin${
                            immobile.inquilini.length === 1 ? "o" : "i"
                        } registrat${
                            immobile.inquilini.length === 1 ? "o" : "i"
                        }`}
                        type="persone"
                        entities={immobile.inquilini as Persona[]}
                    />
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
                <IonButton
                    className="singlePageGeneralButton"
                    color="primary"
                    mode="ios"
                    fill="solid"
                    onClick={copyImmobile}
                >
                    <IonIcon className="rightSpace" icon={copyOutline} />
                    Crea una copia
                </IonButton>
                {isUserAdmin(userData) && (
                    <IonButton
                        className="singlePageGeneralButton"
                        color="danger"
                        mode="ios"
                        fill="solid"
                        onClick={() =>
                            deleteEntity(`immobili`, immobile?.id?.toString()!)
                        }
                    >
                        <IonIcon
                            className="rightSpace"
                            icon={trashBinOutline}
                        />
                        Cancella Immobile
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

export default ImmobilePage;
