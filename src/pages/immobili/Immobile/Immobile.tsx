import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Immobile.module.css";
import { ReactComponent as EuroIcon } from "../../../assets/icons/euro.svg";
import { ReactComponent as SquareMetersIcon } from "../../../assets/icons/planimetry.svg";
import { ReactComponent as HomeIcon } from "../../../assets/icons/house.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import axiosInstance from "../../../utils/axiosInstance";
import {
    addCaratteristiche,
    addFiles,
    addHouses,
} from "../../../store/public-immobile-slice";
import { IonButton, IonCol, IonGrid, IonRow, useIonAlert } from "@ionic/react";
import { capitalize, stringifyNumber } from "../../../utils/stringUtils";
import { changeLoading } from "../../../store/ui-slice";
import FeaturesWrapper from "../../../components/features-wrapper/FeaturesWrapper";
import HousePhoto from "../../../components/house-photo/HousePhoto";
import {
    addLocali,
    getCaratteristicheDefault,
    popolaCaratteristiche,
} from "../../../utils/immobileUtils";

export type FeatureField = {
    value: string;
    label: string;
};

const Immobile: React.FC<{}> = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [presentAlert] = useIonAlert();

    const id = Number.parseInt(
        location.pathname.split("?")[0].split("/").pop()!
    );

    const house = useAppSelector((state) =>
        state.publicImmobile.houses.find((el) => el.id === id)
    );

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchImmobile = async () => {
            dispatch(changeLoading(true));
            try {
                const res = await axiosInstance.get("immobili/" + id);
                if (!house) {
                    dispatch(addHouses([res.data]));
                    return;
                }
                if (house && !house.caratteristiche)
                    dispatch(
                        addCaratteristiche({
                            id,
                            caratteristiche: res.data.caratteristicheImmobile,
                        })
                    );
                if (house && !house.fileFetched)
                    dispatch(addFiles({ id, files: res.data.files }));
                dispatch(changeLoading(false));
            } catch (e: any) {
                dispatch(changeLoading(false));
                presentAlert({
                    header: "Errore",
                    message:
                        e.response &&
                        e.response.data &&
                        e.response.data.message &&
                        e.response.data.message.includes("trovato")
                            ? e.response.data.message
                            : "Errore nella richiesta, operazione fallita",
                    buttons: [
                        {
                            text: "Chiudi",
                            handler: () => navigate(-1),
                        },
                    ],
                });
            }
        };

        fetchImmobile();
    }, [dispatch, id, house, navigate, presentAlert]);

    let caratteristiche = getCaratteristicheDefault();

    if (house) caratteristiche = popolaCaratteristiche(house, caratteristiche);

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

    const goToContattaciPage = () =>
        navigate(`/contattaci?immobileRef=${house?.ref}`);

    return (
        <IonGrid className={`text-center fullHeight ${styles.immobili}`}>
            <IonRow className={`fullHeight ${styles.row}`}>
                <IonButton
                    type="button"
                    expand="full"
                    className={styles.button}
                    onClick={() => goToContattaciPage()}
                >
                    Ti interessa? Contattaci
                </IonButton>
                <IonCol size="12" className={`${styles.houseWrapper}`}>
                    <div className={styles.houseData}>
                        {house && (
                            <h3 className={`centered ${styles.title}`}>
                                <span className={styles.ref}>{house?.ref}</span>
                                {house?.titolo}
                            </h3>
                        )}
                        {house && (
                            <div className={styles.mainData}>
                                <div>
                                    <EuroIcon />
                                    {stringifyNumber(house.prezzo!)}
                                    {house.contratto === "affitto"
                                        ? " al mese"
                                        : ""}
                                </div>
                                <div>
                                    <HomeIcon />{" "}
                                    {capitalize(
                                        house.tipologia ? house.tipologia : ""
                                    )}
                                    {addLocali(house)}
                                </div>
                                <div>
                                    <SquareMetersIcon className={styles.icon} />{" "}
                                    {house.superficie} m²
                                </div>
                            </div>
                        )}

                        {
                            <HousePhoto
                                currentIndex={currentPhotoIndex}
                                onChangeIndex={setCurrentPhotoIndex}
                            />
                        }
                        {house && (
                            <FeaturesWrapper
                                title="Caratteristiche Principali"
                                features={caratteristiche.principali}
                            />
                        )}
                        {house &&
                            house.caratteristiche &&
                            house.caratteristiche.descrizione && (
                                <FeaturesWrapper title="Descrizione">
                                    <div className={styles.descrizione}>
                                        {elaborateDescrizione(
                                            house.caratteristiche.descrizione
                                        )}
                                    </div>
                                </FeaturesWrapper>
                            )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Efficienza Energetica e Riscaldamento"
                                features={caratteristiche.efficienzaEnergetica}
                            />
                        )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Caratteristiche Edificio"
                                features={caratteristiche.costruzione}
                            />
                        )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Caratteristiche Specifiche"
                                features={caratteristiche.specifiche}
                            />
                        )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Caratteristiche Serramenti"
                                features={caratteristiche.serramenti}
                            />
                        )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Caratteristiche Impianti"
                                features={caratteristiche.impianti}
                            />
                        )}
                        {house && house.caratteristiche && (
                            <FeaturesWrapper
                                title="Categoria catastale e spese Previste"
                                features={caratteristiche.spese}
                            />
                        )}
                        {house &&
                            house.caratteristiche &&
                            house.contratto === "affitto" && (
                                <FeaturesWrapper
                                    title="Caratteristiche Locazione"
                                    features={caratteristiche.locazione}
                                ></FeaturesWrapper>
                            )}
                    </div>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Immobile;
