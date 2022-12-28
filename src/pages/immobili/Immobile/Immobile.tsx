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
import {
    capitalize,
    correctZona,
    stringifyNumber,
} from "../../../utils/stringUtils";
import { changeLoading } from "../../../store/ui-slice";
import FeaturesWrapper from "../../../components/features-wrapper/FeaturesWrapper";
import HousePhoto from "../../../components/house-photo/HousePhoto";

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

    const isSpecified = (valore: string | null) =>
        valore &&
        valore.toLowerCase() !== "undefined" &&
        valore.toLowerCase() !== "null";

    const displayNonSpecificatoSeAssente = (valore: any) =>
        isSpecified(valore) ? valore : "Non specificato";

    let caratteristiche: {
        principali: FeatureField[];
        efficienzaEnergetica: FeatureField[];
        costruzione: FeatureField[];
        specifiche: FeatureField[];
        pertinenze: FeatureField[];
        impianti: FeatureField[];
        serramenti: FeatureField[];
        spese: FeatureField[];
        locazione: FeatureField[];
    } = {
        principali: [],
        efficienzaEnergetica: [],
        costruzione: [],
        specifiche: [],
        pertinenze: [],
        impianti: [],
        serramenti: [],
        spese: [],
        locazione: [],
    };

    if (house) {
        if (isSpecified(house.categoria) && isSpecified(house.contratto)) {
            caratteristiche.principali.push({
                value: `${
                    house.contratto!.charAt(0).toUpperCase() +
                    house.contratto!.substring(1)
                } di immobile ${house.categoria}`,
                label: "Categoria",
            });
        }
        const tipologia = house.tipologia;
        if (
            tipologia &&
            tipologia !== "box" &&
            tipologia !== "camera singola" &&
            tipologia !== "loft" &&
            tipologia !== "posto auto" &&
            tipologia !== "posto letto in camera condivisa" &&
            tipologia !== "uffici open space"
        ) {
            caratteristiche.principali.push({
                value: `${house.locali}`,
                label: "Locali",
            });
        }
        if (isSpecified(house.stato)) {
            caratteristiche.principali.push({
                value: `${house.stato} ${
                    house.libero ? `(Libero ${house.libero.toLowerCase()})` : ""
                }`,
                label: "Stato dell'immobile",
            });
        }
        if (isSpecified(house.indirizzo)) {
            caratteristiche.principali.push({
                value: `${house.indirizzo}`,
                label: "Indirizzo",
            });
        }
        if (isSpecified(house.comune)) {
            caratteristiche.principali.push({
                value: `${house.comune} ${
                    house.zona ? `(${correctZona(house.zona)})` : ""
                }`,
                label: "Comune",
            });
        }
    }

    if (house && house.caratteristiche) {
        caratteristiche.efficienzaEnergetica = [
            {
                value: `${
                    house.classeEnergetica?.toString().trim().toUpperCase() ===
                    "ESENTE"
                        ? "Esente"
                        : house.classeEnergetica?.toString().trim()
                }${
                    house.classeEnergetica?.toString().trim().toUpperCase() !==
                    "ESENTE"
                        ? ` ${
                              house.consumo! <= 175 ? house.consumo : `> 175`
                          } kWh/m² anno`
                        : ""
                }`,
                label: "Classe energetica",
            },
            {
                value: `${house.riscaldamento} ${
                    house.caratteristiche.combustibile
                        ? `(Combustibile ${house.caratteristiche.combustibile.toLowerCase()})`
                        : ""
                }`,
                label: "Riscaldamento",
            },
        ];
        if (
            house.riscaldamento &&
            house.riscaldamento.trim().toLowerCase() === "autonomo"
        ) {
            caratteristiche.efficienzaEnergetica.push({
                value: house.caratteristiche.speseRiscaldamento + " €/mese",
                label: "Spese riscaldamento",
            });
        }
        if (isSpecified(house.caratteristiche.ariaCondizionata)) {
            caratteristiche.efficienzaEnergetica.push({
                value: house.caratteristiche.ariaCondizionata!,
                label: "Aria condizionata",
            });
        }

        if (house.caratteristiche.annoCostruzione) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.annoCostruzione.toString(),
                label: "Anno di costruzione dell'immobile",
            });
        }

        if (isSpecified(house.caratteristiche.cablato)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.cablato!,
                label: "Cablato",
            });
        }

        if (isSpecified(house.caratteristiche.citofono)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.citofono!,
                label: "Citofono",
            });
        }

        if (isSpecified(house.caratteristiche.portineria)) {
            caratteristiche.costruzione.push({
                value: house.caratteristiche.portineria!,
                label: "Portineria",
            });
        }

        caratteristiche.costruzione.push({
            value: house.caratteristiche.ascensore
                ? "Presente"
                : "Non presente",
            label: "Ascensore",
        });

        if (isSpecified(house.piano)) {
            caratteristiche.specifiche.push({
                value: `${house.piano} (${
                    house.caratteristiche.ascensore ? `Con` : "Senza"
                } ascensore)`,
                label: "Piano",
            });
        }

        if (isSpecified(house.caratteristiche.esposizione)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.esposizione!,
                label: "Esposizione",
            });
        }

        if (isSpecified(house.caratteristiche.balconi)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.balconi!,
                label: "Balconi",
            });
        }

        if (isSpecified(house.caratteristiche.terrazzi)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.terrazzi!,
                label: "Terrazzi",
            });
        }

        if (isSpecified(house.caratteristiche.antifurto)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.antifurto!,
                label: "Antifurto",
            });
        }

        if (isSpecified(house.caratteristiche.altezza)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.altezza + " metri",
                label: "Altezza",
            });
        }

        if (isSpecified(house.caratteristiche.arredamento)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.arredamento!,
                label: "Arredamento",
            });
        }

        if (isSpecified(house.caratteristiche.mansarda)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.mansarda!,
                label: "Mansarda",
            });
        }

        if (isSpecified(house.caratteristiche.taverna)) {
            caratteristiche.specifiche.push({
                value: house.caratteristiche.taverna!,
                label: "Taverna",
            });
        }

        caratteristiche.specifiche.unshift({
            value: house.caratteristiche.portaBlindata
                ? "Blindata"
                : "Non blindata",
            label: "Porta d'ingresso",
        });

        if (
            house.caratteristiche.livelli &&
            house.caratteristiche.livelli > 1
        ) {
            caratteristiche.specifiche.unshift({
                value: `L'immobile si distribuisce su ${house.caratteristiche.livelli} livelli`,
                label: "Livelli",
            });
        }

        if (isSpecified(house.caratteristiche.proprieta)) {
            caratteristiche.specifiche.unshift({
                value: house.caratteristiche.proprieta!,
                label: "Proprietà",
            });
        }

        caratteristiche.pertinenze = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.box
                ),
                label: "Box",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.cantina
                ),
                label: "Cantina",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.giardino
                ),
                label: "Giardino",
            },
        ];
        caratteristiche.serramenti = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.serramentiInterni
                ),
                label: "Serramenti interni",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.serramentiEsterni
                ),
                label: "Serramenti esterni",
            },
        ];
        caratteristiche.impianti = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.impiantoElettrico
                ),
                label: "Impianto elettrico",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.impiantoIdraulico
                ),
                label: "Impianto idraulico",
            },
        ];
        caratteristiche.spese = [
            {
                value: house.caratteristiche.speseCondominiali
                    ? `${house.caratteristiche.speseCondominiali} € al mese circa`
                    : "Non sono previste spese di gestione",
                label: "Spese condominiali",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.speseExtraNote
                ),
                label: "Spese extra",
            },
        ];

        if (
            house.caratteristiche.categoriaCatastale &&
            house.caratteristiche.rendita
        ) {
            caratteristiche.spese.unshift({
                value: `${
                    house.caratteristiche.categoriaCatastale
                } (${stringifyNumber(house.caratteristiche.rendita)} €/anno)`,
                label: "Categoria catastale e rendita catastale",
            });
        }

        caratteristiche.locazione = [
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.cauzione
                ),
                label: "Cauzione necessaria all'ingresso",
            },
            {
                value: displayNonSpecificatoSeAssente(
                    house.caratteristiche.tipoContratto
                ),
                label: "Tipo contratto",
            },
        ];
    }

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
