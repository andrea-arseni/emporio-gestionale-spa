import {
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonInput,
    IonTextarea,
    IonNote,
    IonButton,
    IonItemDivider,
    IonItemGroup,
    useIonAlert,
    IonLoading,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { Caratteristiche } from "../../../entities/caratteristiche.model";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import {
    ariaCondizionata,
    possibiliAC,
} from "../../../types/aria_condizionata";
import { arredamento, possibiliArredamenti } from "../../../types/arredamento";
import {
    balconi_terrazzi,
    possibiliBalconiTerrazzi,
} from "../../../types/balconi_terrazzi";
import { box, possibiliBox } from "../../../types/box";
import { categoria, possibleCategories } from "../../../types/categoria";
import {
    categoriaCatastale,
    possibiliCategorieCatastali,
} from "../../../types/categoria_catastale";
import { citofono, possibleCitofoni } from "../../../types/citofono";
import {
    classeEnergetica,
    possibleEnergeticClasses,
} from "../../../types/classeEnergetica";
import {
    combustibile,
    possibleCombustibili,
} from "../../../types/combustibile";
import { possibleComuni, possibleZona } from "../../../types/comuni";
import { contratto, possibleContratti } from "../../../types/contratto";
import { esposizione, possibiliEsposizioni } from "../../../types/esposizione";
import { giardino, possibiliGiardini } from "../../../types/giardino";
import { immobileAttribute } from "../../../types/immobili_attributes";
import { impianto, possibiliImpianti } from "../../../types/impianto";
import { libero, possibleLibero } from "../../../types/libero";
import { livelli, possibleLivelli } from "../../../types/livelli";
import { locali, possibleLocali } from "../../../types/locali";
import { piano, possiblePiano } from "../../../types/piano";
import { portineria, possiblePortineria } from "../../../types/portineria";
import { possibiliProprieta, proprieta } from "../../../types/proprieta";
import { possibleRiscaldamenti } from "../../../types/riscaldamento";
import {
    possibleSerramentiEsterni,
    serramentiEsterni,
} from "../../../types/serramenti_esterni";
import {
    possibleSerramentiInterni,
    serramentiInterni,
} from "../../../types/serramenti_interni";
import { possibleStato, stato } from "../../../types/stato";
import { possibleStatus, status } from "../../../types/status";
import { possibleTipologies, tipologia } from "../../../types/tipologia";
import axiosInstance from "../../../utils/axiosInstance";
import capitalize from "../../../utils/capitalize";
import errorHandler from "../../../utils/errorHandler";
import { genericaDescrizione } from "../../../utils/genericaDescrizione";
import FormInputBoolean from "../../form-components/form-input-boolean/FormInputBoolean";
import FormInputNumber from "../../form-components/form-input-number/form-input-number";
import FormInputText from "../../form-components/form-input-text/FormInputText";
import FormSelect from "../../form-components/form-select/FormSelect";

const ImmobileForm: React.FC<{
    immobile: Immobile | null;
    backToList: () => void;
}> = (props) => {
    const [isAutomaticRef, setIsAutomaticRef] = useState<boolean | null>(true);

    const [isManualTown, setIsManualTown] = useState<boolean>(false);

    const [refValue, setRefValue] = useState<number | null>(
        props.immobile ? props.immobile.ref : null
    );

    const [titleValue, setTitleValue] = useState<string | null>(
        props.immobile ? props.immobile.titolo : null
    );

    const [isTitleValid, setIsTitleValid] = useState<boolean | null>(true);

    const [superficieValue, setSuperficieValue] = useState<number | null>(
        props.immobile ? props.immobile.superficie : null
    );

    const [isSuperficieValid, setIsSuperficieValid] = useState<boolean | null>(
        true
    );

    const [tipologiaValue, setTipologiaValue] = useState<tipologia | null>(
        props.immobile ? props.immobile.tipologia : null
    );

    const [localiValue, setLocaliValue] = useState<locali | null>(
        props.immobile ? props.immobile.locali : null
    );

    const [comuneValue, setComuneValue] = useState<string | null>(
        props.immobile ? props.immobile.comune : null
    );

    const [zonaValue, setZonaValue] = useState<string | null>(
        props.immobile ? props.immobile.zona : null
    );

    const [indirizzoValue, setIndirizzoValue] = useState<string | null>(
        props.immobile ? props.immobile.indirizzo : null
    );

    const [prezzoValue, setPrezzoValue] = useState<number | null>(
        props.immobile ? props.immobile.prezzo : null
    );

    const [isPrezzoValid, setIsPrezzoValid] = useState<boolean | null>(true);

    const [riscaldamentoValue, setRiscaldamentoValue] = useState<
        "centralizzato" | "autonomo" | null
    >(props.immobile ? props.immobile.riscaldamento : null);

    const [classeEnergeticaValue, setClasseEnergeticaValue] =
        useState<classeEnergetica | null>(null);

    const [consumoValue, setConsumoValue] = useState<number | null>(
        props.immobile ? props.immobile.consumo : null
    );

    const [isConsumoValid, setIsConsumoValid] = useState<boolean | null>(true);

    const [contrattoValue, setContrattoValue] = useState<contratto | null>(
        props.immobile ? props.immobile.contratto : null
    );

    const [categoriaValue, setCategoriaValue] = useState<categoria | null>(
        props.immobile ? props.immobile.categoria : null
    );

    const [statoValue, setStatoValue] = useState<stato | null>(
        props.immobile ? props.immobile.stato : null
    );

    const [liberoValue, setLiberoValue] = useState<libero | null>(
        props.immobile ? props.immobile.libero : null
    );

    const [statusValue, setStatusValue] = useState<status | null>(
        props.immobile ? props.immobile.status : null
    );

    const [pianoValue, setPianoValue] = useState<piano | null>(
        props.immobile ? props.immobile.piano : null
    );

    const [totalePianiValue, setTotalePianiValue] = useState<number | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.totalePiani
            : null
    );

    const [proprietarioValue, setProprietarioValue] = useState<Persona | null>(
        props.immobile ? props.immobile.proprietario : null
    );

    const [descrizioneValue, setDescrizioneValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.descrizione
            : null
    );

    const [isDescrizioneVirgin, setIsDescrizioneVirgin] = useState<boolean>(
        !props.immobile ||
            props.immobile.caratteristiche?.descrizione === genericaDescrizione
    );

    const [esposizioneValue, setEsposizioneValue] =
        useState<esposizione | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.esposizione
                : null
        );

    const [speseCondominialiValue, setSpeseCondominialiValue] = useState<
        number | null
    >(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.speseCondominiali
            : null
    );

    const [isSpeseCondominialiValid, setIsSpeseCondominialiValid] =
        useState<boolean>(true);

    const [speseExtraValue, setSpeseExtraValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.speseExtraNote
            : null
    );

    const [ascensoreValue, setAscensoreValue] = useState<boolean | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.ascensore
            : null
    );

    const [arredamentoValue, setArredamentoValue] =
        useState<arredamento | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.arredamento
                : null
        );

    const [balconiValue, setBalconiValue] = useState<balconi_terrazzi | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.balconi
            : null
    );

    const [terrazziValue, setTerrazziValue] = useState<balconi_terrazzi | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.terrazzi
            : null
    );

    const [boxValue, setBoxValue] = useState<box | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.box
            : null
    );

    const [giardinoValue, setGiardinoValue] = useState<giardino | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.giardino
            : null
    );

    const [tavernaValue, setTavernaValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.taverna
            : null
    );

    const [mansardaValue, setMansardaValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.mansarda
            : null
    );

    const [cantinaValue, setCantinaValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.cantina
            : null
    );

    const [speseRiscaldamentoValue, setSpeseRiscaldamentoValue] = useState<
        number | null
    >(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.speseRiscaldamento
            : null
    );

    const [isSpeseRiscaldamentoValid, setIsSpeseRiscaldamentoValid] =
        useState<boolean>(true);

    const [ariaCondizionataValue, setAriaCondizionataValue] =
        useState<ariaCondizionata | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.ariaCondizionata
                : null
        );

    const [proprietaValue, setProprietaValue] = useState<proprieta | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.proprieta
            : null
    );

    const [categoriaCatastaleValue, setCategoriaCatastaleValue] =
        useState<categoriaCatastale | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.categoriaCatastale
                : null
        );

    const [renditaValue, setRenditaValue] = useState<number | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.rendita
            : null
    );

    const [isRenditaValid, setIsRenditaValid] = useState<boolean>(true);

    const [impiantoElettricoValue, setImpiantoElettricoValue] =
        useState<impianto | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.impiantoElettrico
                : null
        );

    const [impiantoIdraulicoValue, setImpiantoIdraulicoValue] =
        useState<impianto | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.impiantoIdraulico
                : null
        );

    const [livelliValue, setLivelliValue] = useState<livelli | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.livelli
            : null
    );

    const [serramentiInterniValue, setSerramentiInterniValue] =
        useState<serramentiInterni | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.serramentiInterni
                : null
        );

    const [serramentiEsterniValue, setSerramentiEsterniValue] =
        useState<serramentiEsterni | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.serramentiEsterni
                : null
        );

    const [portaBlindataValue, setPortaBlindataValue] = useState<
        boolean | null
    >(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.portaBlindata
            : null
    );

    const [antifurtoValue, setAntifurtoValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.antifurto
            : null
    );

    const [citofonoValue, setCitofonoValue] = useState<citofono | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.citofono
            : null
    );

    const [annoCostruzioneValue, setAnnoCostruzioneValue] = useState<
        number | null
    >(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.annoCostruzione
            : null
    );

    const [isAnnoCostruzioneValid, setIsAnnoCostruzioneValid] =
        useState<boolean>(true);

    const [portineriaValue, setPortineriaValue] = useState<portineria | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.portineria
            : null
    );

    const [combustibileValue, setCombustibileValue] =
        useState<combustibile | null>(
            props.immobile && props.immobile.caratteristiche
                ? props.immobile.caratteristiche.combustibile
                : null
        );

    const [cablatoValue, setCablatoValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.cablato
            : null
    );

    const [tipoContrattoValue, setTipoContrattoValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.tipoContratto
            : null
    );

    const [cauzioneValue, setCauzioneValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.cauzione
            : null
    );

    const [altezzaValue, setAltezzaValue] = useState<string | null>(
        props.immobile && props.immobile.caratteristiche
            ? props.immobile.caratteristiche.altezza
            : null
    );

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const isFormValid =
        titleValue &&
        isTitleValid &&
        superficieValue &&
        isSuperficieValid &&
        tipologiaValue &&
        localiValue &&
        comuneValue &&
        indirizzoValue &&
        prezzoValue &&
        isPrezzoValid &&
        riscaldamentoValue &&
        classeEnergeticaValue &&
        consumoValue &&
        isConsumoValid &&
        contrattoValue &&
        categoriaValue &&
        statoValue &&
        statusValue &&
        liberoValue &&
        pianoValue &&
        isSpeseCondominialiValid &&
        isSpeseRiscaldamentoValid &&
        isRenditaValid &&
        isAnnoCostruzioneValid &&
        !isDescrizioneVirgin;

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const immobile = new Immobile(
            null,
            isAutomaticRef ? null : refValue,
            titleValue,
            superficieValue,
            null,
            tipologiaValue,
            localiValue,
            indirizzoValue,
            zonaValue ? zonaValue : "",
            comuneValue,
            prezzoValue ? +prezzoValue.toString().replace(".", "") : null,
            riscaldamentoValue,
            classeEnergeticaValue,
            consumoValue,
            contrattoValue,
            categoriaValue,
            statoValue,
            liberoValue,
            statusValue,
            pianoValue,
            null,
            null,
            null,
            null
        );
        const caratteristicheImmobile = new Caratteristiche(
            null,
            descrizioneValue,
            esposizioneValue,
            speseCondominialiValue
                ? +speseCondominialiValue.toString().split(".")[0].split(",")[0]
                : null,
            speseExtraValue,
            ascensoreValue,
            arredamentoValue,
            balconiValue,
            terrazziValue,
            boxValue,
            giardinoValue,
            tavernaValue,
            mansardaValue,
            cantinaValue,
            speseRiscaldamentoValue,
            ariaCondizionataValue,
            proprietaValue,
            categoriaCatastaleValue,
            renditaValue,
            impiantoElettricoValue,
            impiantoIdraulicoValue,
            livelliValue,
            serramentiInterniValue,
            serramentiEsterniValue,
            portaBlindataValue,
            antifurtoValue,
            citofonoValue,
            annoCostruzioneValue,
            portineriaValue,
            combustibileValue,
            cablatoValue,
            tipoContrattoValue,
            cauzioneValue,
            null,
            altezzaValue,
            totalePianiValue
        );
        setShowLoading(true);
        try {
            const res = await axiosInstance.post(`immobili`, {
                immobile,
                proprietario: { id: 626 },
                caratteristicheImmobile,
            });
            setShowLoading(false);
            presentAlert({
                header: "Ottimo",
                subHeader: `Immobile ${
                    props.immobile ? "modificato" : "creato"
                }`,
                message: `Riferimento: ${res.data.ref}`,
                buttons: [
                    {
                        text: "OK",
                        handler: () => props.backToList(),
                    },
                ],
            });
        } catch (error: any) {
            setShowLoading(false);
            errorHandler(
                error,
                () => {},
                "Procedura non riuscita",
                presentAlert
            );
        }
    };

    const changeImmobileValue = (e: any, type: immobileAttribute) => {
        switch (type) {
            case "ref":
                setRefValue(e.detail.value);
                break;
            case "title":
                setTitleValue(e.detail.value);
                setIsTitleValid(
                    e.detail.value.toString().length >= 15 &&
                        e.detail.value.toString().length <= 60
                );
                break;
            case "superficie":
                setSuperficieValue(e.detail.value);
                setIsSuperficieValid(e.detail.value > 0);
                break;
            case "tipologia":
                setTipologiaValue(e.detail.value);
                break;
            case "locali":
                setLocaliValue(e.detail.value);
                break;
            case "comune":
                setZonaValue(null);
                if (e.detail.value === "notInList") {
                    setIsManualTown(true);
                    setComuneValue("");
                } else {
                    setComuneValue(e.detail.value);
                }
                break;
            case "zona":
                setZonaValue(
                    possibleZona.find((el) => el.id === e.detail.value)!.id
                );
                break;
            case "indirizzo":
                setIndirizzoValue(e.detail.value);
                break;
            case "prezzo":
                setPrezzoValue(e.detail.value);
                setIsPrezzoValid(e.detail.value > 0);
                break;
            case "riscaldamento":
                setRiscaldamentoValue(e.detail.value);
                break;
            case "classeEnergetica":
                setClasseEnergeticaValue(e.detail.value);
                break;
            case "consumo":
                setConsumoValue(e.detail.value);
                setIsConsumoValid(e.detail.value > 0 && e.detail.value <= 175);
                break;
            case "contratto":
                setContrattoValue(e.detail.value);
                break;
            case "categoria":
                setCategoriaValue(e.detail.value);
                break;
            case "stato":
                setStatoValue(e.detail.value);
                break;
            case "libero":
                setLiberoValue(e.detail.value);
                break;
            case "status":
                setStatusValue(e.detail.value);
                break;
            case "piano":
                setPianoValue(e.detail.value);
                break;
            case "proprietario":
                setProprietarioValue(e.detail.value);
                break;
            case "descrizione":
                setDescrizioneValue(e.detail.value);
                setIsDescrizioneVirgin(false);
                break;
            case "esposizione":
                setEsposizioneValue(e.detail.value);
                break;
            case "arredamento":
                setArredamentoValue(e.detail.value);
                break;
            case "speseCondominiali":
                setSpeseCondominialiValue(e.detail.value);
                setIsSpeseCondominialiValid(e.detail.value >= 0);
                break;
            case "speseExtraNote":
                setSpeseExtraValue(e.detail.value);
                break;
            case "ascensore":
                setAscensoreValue(e.detail.value);
                break;
            case "balconi":
                setBalconiValue(e.detail.value);
                break;
            case "terrazzi":
                setTerrazziValue(e.detail.value);
                break;
            case "box":
                setBoxValue(e.detail.value);
                break;
            case "giardino":
                setGiardinoValue(e.detail.value);
                break;
            case "taverna":
                setTavernaValue(e.detail.value);
                break;
            case "mansarda":
                setMansardaValue(e.detail.value);
                break;
            case "cantina":
                setCantinaValue(e.detail.value);
                break;
            case "speseRiscaldamento":
                setSpeseRiscaldamentoValue(e.detail.value);
                setIsSpeseRiscaldamentoValid(e.detail.value >= 0);
                break;
            case "ariaCondizionata":
                setAriaCondizionataValue(e.detail.value);
                break;
            case "proprieta":
                setProprietaValue(e.detail.value);
                break;
            case "categoriaCatastale":
                setCategoriaCatastaleValue(e.detail.value);
                break;
            case "rendita":
                setRenditaValue(e.detail.value);
                setIsRenditaValid(e.detail.value >= 0);
                break;
            case "impiantoElettrico":
                setImpiantoElettricoValue(e.detail.value);
                break;
            case "impiantoIdraulico":
                setImpiantoIdraulicoValue(e.detail.value);
                break;
            case "livelli":
                setLivelliValue(e.detail.value);
                break;
            case "serramentiInterni":
                setSerramentiInterniValue(e.detail.value);
                break;
            case "serramentiEsterni":
                setSerramentiEsterniValue(e.detail.value);
                break;
            case "portaBlindata":
                setPortaBlindataValue(e.detail.value);
                break;
            case "antifurto":
                setAntifurtoValue(e.detail.value);
                break;
            case "annoCostruzione":
                setAnnoCostruzioneValue(e.detail.value);
                setIsAnnoCostruzioneValid(
                    e.detail.value >= 1800 &&
                        e.detail.value <= new Date().getFullYear()
                );
                break;
            case "citofono":
                setCitofonoValue(e.detail.value);
                break;
            case "portineria":
                setPortineriaValue(e.detail.value);
                break;
            case "combustibile":
                setCombustibileValue(e.detail.value);
                break;
            case "cablato":
                setCablatoValue(e.detail.value);
                break;
            case "tipoContratto":
                setTipoContrattoValue(e.detail.value);
                break;
            case "cauzione":
                setCauzioneValue(e.detail.value);
                break;
            case "altezza":
                setAltezzaValue(e.detail.value);
                break;
            case "totalePiani":
                setTotalePianiValue(e.detail.value);
                break;
            default:
                console.log("Error!");
                break;
        }
    };

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <IonItemGroup>
                    <IonItemDivider color="dark">
                        <IonLabel color="light">
                            <h2>Dati base - Obbligatori</h2>
                        </IonLabel>
                    </IonItemDivider>
                    {!props.immobile && (
                        <FormInputBoolean
                            condition={isAutomaticRef}
                            setCondition={setIsAutomaticRef}
                            sentence="Riferimento assegnato in automatico"
                        />
                    )}
                    {(props.immobile || !isAutomaticRef) && (
                        <FormInputNumber
                            titolo="Riferimento"
                            type="ref"
                            value={refValue}
                            changeHandler={changeImmobileValue}
                            invalidCondition={!!refValue && refValue <= 0}
                            invalidNote="Il riferimento deve essere maggiore di 0"
                        />
                    )}

                    <IonItem>
                        <IonLabel position="floating">
                            Titolo (tra 15 e 60 lettere)
                        </IonLabel>
                        <IonInput
                            type="text"
                            value={titleValue}
                            onIonChange={(e) => changeImmobileValue(e, "title")}
                        ></IonInput>
                        <IonNote color={isTitleValid ? "primary" : "danger"}>
                            {`${titleValue ? titleValue.length : 0} letter${
                                titleValue?.length === 1 ? "a" : "e"
                            } usat${titleValue?.length === 1 ? "a" : "e"}`}
                        </IonNote>
                    </IonItem>
                    <FormInputNumber
                        titolo="Superficie in metri quadri"
                        type="superficie"
                        value={superficieValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isSuperficieValid}
                        invalidNote="La superficie deve essere maggiore di 0 metri
                                quadri"
                    />
                    <FormSelect
                        title="Tipologia"
                        value={tipologiaValue}
                        function={changeImmobileValue}
                        type={"tipologia"}
                        possibleValues={possibleTipologies}
                    />
                    <FormSelect
                        title="Locali"
                        value={localiValue}
                        function={changeImmobileValue}
                        type={"locali"}
                        possibleValues={possibleLocali}
                    />
                    {!isManualTown && (
                        <IonItem>
                            <IonLabel position="floating">Comune</IonLabel>
                            <IonSelect
                                cancelText="Torna Indietro"
                                mode="ios"
                                interface="action-sheet"
                                value={comuneValue}
                                onIonChange={(e) =>
                                    changeImmobileValue(e, "comune")
                                }
                            >
                                {possibleComuni.map((el) => (
                                    <IonSelectOption key={el} value={el}>
                                        {capitalize(el)}
                                    </IonSelectOption>
                                ))}
                                <IonSelectOption value="notInList">
                                    Non presente in lista
                                </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    )}
                    {isManualTown && (
                        <FormInputText
                            titolo="Comune"
                            value={comuneValue}
                            changeHandler={changeImmobileValue}
                            type={"comune"}
                        />
                    )}
                    {(comuneValue === "Segrate" ||
                        comuneValue === "Milano") && (
                        <IonItem>
                            <IonLabel position="floating">Zona</IonLabel>
                            <IonSelect
                                cancelText="Torna Indietro"
                                mode="ios"
                                interface="action-sheet"
                                value={zonaValue}
                                onIonChange={(e) =>
                                    changeImmobileValue(e, "zona")
                                }
                            >
                                {possibleZona
                                    .filter((e) => e.comune === comuneValue)
                                    .map((el) => (
                                        <IonSelectOption
                                            key={el.id}
                                            value={el.id}
                                        >
                                            {capitalize(el.text)}
                                        </IonSelectOption>
                                    ))}
                            </IonSelect>
                        </IonItem>
                    )}
                    <FormInputText
                        titolo="Indirizzo"
                        value={indirizzoValue}
                        changeHandler={changeImmobileValue}
                        type={"indirizzo"}
                    />
                    <FormInputNumber
                        titolo="Prezzo Richiesto"
                        type="prezzo"
                        value={prezzoValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isPrezzoValid}
                        invalidNote="Il prezzo deve essere maggiore di 0 €"
                    />
                    <FormSelect
                        title="Riscaldamento"
                        value={riscaldamentoValue}
                        function={changeImmobileValue}
                        type={"riscaldamento"}
                        possibleValues={possibleRiscaldamenti}
                    />
                    <FormSelect
                        title="Classe Energetica"
                        value={classeEnergeticaValue}
                        function={changeImmobileValue}
                        type={"classeEnergetica"}
                        possibleValues={possibleEnergeticClasses}
                    />
                    <FormInputNumber
                        titolo="Consumo espresso in KWh/m³a"
                        type="consumo"
                        value={consumoValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isConsumoValid}
                        invalidNote="Il consumo deve essere compreso tra 0 e 175 KWh/m³a"
                    />
                    <FormSelect
                        title="Contratto"
                        value={contrattoValue}
                        function={changeImmobileValue}
                        type={"contratto"}
                        possibleValues={possibleContratti}
                    />
                    <FormSelect
                        title="Categoria"
                        value={categoriaValue}
                        function={changeImmobileValue}
                        type={"categoria"}
                        possibleValues={possibleCategories}
                    />
                    <FormSelect
                        title="Stato"
                        value={statoValue}
                        function={changeImmobileValue}
                        type={"stato"}
                        possibleValues={possibleStato}
                    />
                    <FormSelect
                        title="Libero"
                        value={liberoValue}
                        function={changeImmobileValue}
                        type={"libero"}
                        possibleValues={possibleLibero}
                    />
                    <FormSelect
                        title="Status"
                        value={statusValue}
                        function={changeImmobileValue}
                        type={"status"}
                        possibleValues={possibleStatus.map((el) =>
                            el.toLowerCase()
                        )}
                    />
                    <FormSelect
                        title="Piano"
                        value={pianoValue}
                        function={changeImmobileValue}
                        type={"piano"}
                        possibleValues={possiblePiano}
                    />
                    <FormInputNumber
                        titolo="Totale piani edificio"
                        type="totalePiani"
                        value={totalePianiValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={false}
                        invalidNote=""
                    />
                    <IonButton expand="block" color="primary">
                        Aggiungi Proprietario
                    </IonButton>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider color="dark">
                        <IonLabel color="light">
                            <h2>Caratteristiche - Opzionali</h2>
                        </IonLabel>
                    </IonItemDivider>
                    <FormInputBoolean
                        condition={ascensoreValue}
                        setCondition={setAscensoreValue}
                        sentence="E' presente l'ascensore"
                    />
                    <FormInputBoolean
                        condition={portaBlindataValue}
                        setCondition={setPortaBlindataValue}
                        sentence="La porta d'ingresso è blindata"
                    />
                    <FormInputNumber
                        titolo="Spese condominiali (€ al mese)"
                        type="speseCondominiali"
                        value={speseCondominialiValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isSpeseCondominialiValid}
                        invalidNote="Le spese condominiali non possono essere più basse di 0 €/mese"
                    />
                    <FormInputText
                        titolo="Note su Spese-Extra"
                        value={speseExtraValue}
                        changeHandler={changeImmobileValue}
                        type={"speseExtraNote"}
                    />
                    <FormInputText
                        titolo="Descrizione Taverna"
                        value={tavernaValue}
                        changeHandler={changeImmobileValue}
                        type={"taverna"}
                    />
                    <FormInputText
                        titolo="Descrizione Mansarda"
                        value={mansardaValue}
                        changeHandler={changeImmobileValue}
                        type={"mansarda"}
                    />
                    <FormInputText
                        titolo="Descrizione Cantina"
                        value={cantinaValue}
                        changeHandler={changeImmobileValue}
                        type={"cantina"}
                    />
                    {riscaldamentoValue === "autonomo" && (
                        <FormInputNumber
                            titolo="Spese riscaldamento (€ al mese)"
                            type="speseRiscaldamento"
                            value={speseRiscaldamentoValue}
                            changeHandler={changeImmobileValue}
                            invalidCondition={!isSpeseRiscaldamentoValid}
                            invalidNote="Le spese di riscaldamento non possono essere più basse di 0 €/mese"
                        />
                    )}
                    <FormInputText
                        titolo="Antifurto"
                        value={antifurtoValue}
                        changeHandler={changeImmobileValue}
                        type={"antifurto"}
                    />
                    <FormSelect
                        title="Esposizione"
                        value={esposizioneValue}
                        function={changeImmobileValue}
                        type={"esposizione"}
                        possibleValues={possibiliEsposizioni}
                    />
                    <FormSelect
                        title="Arredamento"
                        value={arredamentoValue}
                        function={changeImmobileValue}
                        type={"arredamento"}
                        possibleValues={possibiliArredamenti}
                    />
                    <FormSelect
                        title="Balconi"
                        value={balconiValue}
                        function={changeImmobileValue}
                        type={"balconi"}
                        possibleValues={possibiliBalconiTerrazzi}
                    />
                    <FormSelect
                        title="Terrazzi"
                        value={terrazziValue}
                        function={changeImmobileValue}
                        type={"terrazzi"}
                        possibleValues={possibiliBalconiTerrazzi}
                    />
                    <FormSelect
                        title="Box"
                        value={boxValue}
                        function={changeImmobileValue}
                        type={"box"}
                        possibleValues={possibiliBox}
                    />
                    <FormSelect
                        title="Giardino"
                        value={giardinoValue}
                        function={changeImmobileValue}
                        type={"giardino"}
                        possibleValues={possibiliGiardini}
                    />
                    <FormSelect
                        title="Aria Condizionata"
                        value={ariaCondizionataValue}
                        function={changeImmobileValue}
                        type={"ariaCondizionata"}
                        possibleValues={possibiliAC}
                    />
                    <FormSelect
                        title="Proprietà"
                        value={proprietaValue}
                        function={changeImmobileValue}
                        type={"proprieta"}
                        possibleValues={possibiliProprieta}
                    />
                    <FormInputNumber
                        titolo="Anno di Costruzione"
                        type="annoCostruzione"
                        value={annoCostruzioneValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isAnnoCostruzioneValid}
                        invalidNote={`L'anno di costruzione deve essere compreso tra il 1800 ed il ${new Date().getFullYear()}`}
                    />
                    <FormSelect
                        title="Categoria Catastale"
                        value={categoriaCatastaleValue}
                        function={changeImmobileValue}
                        type={"categoriaCatastale"}
                        possibleValues={possibiliCategorieCatastali}
                    />
                    <FormInputNumber
                        titolo="Rendita Catastale (€/anno)"
                        type="rendita"
                        value={renditaValue}
                        changeHandler={changeImmobileValue}
                        invalidCondition={!isRenditaValid}
                        invalidNote="La rendita catastale non può essere più bassa di 0 €/anno"
                    />
                    <FormSelect
                        title="Impianto Elettrico"
                        value={impiantoElettricoValue}
                        function={changeImmobileValue}
                        type={"impiantoElettrico"}
                        possibleValues={possibiliImpianti}
                    />
                    <FormSelect
                        title="Impianto Idraulico"
                        value={impiantoIdraulicoValue}
                        function={changeImmobileValue}
                        type={"impiantoIdraulico"}
                        possibleValues={possibiliImpianti}
                    />
                    <FormSelect
                        title="Combustibile"
                        value={combustibileValue}
                        function={changeImmobileValue}
                        type={"combustibile"}
                        possibleValues={possibleCombustibili}
                    />
                    <FormSelect
                        title="Livelli"
                        value={livelliValue}
                        function={changeImmobileValue}
                        type={"livelli"}
                        possibleValues={possibleLivelli}
                    />
                    <FormSelect
                        title="Serramenti Interni"
                        value={serramentiInterniValue}
                        function={changeImmobileValue}
                        type={"serramentiInterni"}
                        possibleValues={possibleSerramentiInterni}
                    />
                    <FormSelect
                        title="Serramenti Esterni"
                        value={serramentiEsterniValue}
                        function={changeImmobileValue}
                        type={"serramentiEsterni"}
                        possibleValues={possibleSerramentiEsterni}
                    />
                    <FormSelect
                        title="Citofono"
                        value={citofonoValue}
                        function={changeImmobileValue}
                        type={"citofono"}
                        possibleValues={possibleCitofoni}
                    />
                    <FormSelect
                        title="Portineria"
                        value={portineriaValue}
                        function={changeImmobileValue}
                        type={"portineria"}
                        possibleValues={possiblePortineria}
                    />
                    <FormInputText
                        titolo="Cablato"
                        value={cablatoValue}
                        changeHandler={changeImmobileValue}
                        type={"cablato"}
                    />
                    <FormInputText
                        titolo="Altezza soffitto"
                        value={altezzaValue}
                        changeHandler={changeImmobileValue}
                        type={"altezza"}
                    />
                    {contrattoValue === "affitto" && (
                        <>
                            <FormInputText
                                titolo="Tipo Contratto"
                                value={tipoContrattoValue}
                                changeHandler={changeImmobileValue}
                                type={"tipoContratto"}
                            />
                            <FormInputText
                                titolo="Cauzione"
                                value={cauzioneValue}
                                changeHandler={changeImmobileValue}
                                type={"cauzione"}
                            />
                        </>
                    )}
                    <IonItem>
                        <IonLabel position="floating">Descrizione</IonLabel>
                        <IonTextarea
                            color={isDescrizioneVirgin ? "danger" : "dark"}
                            auto-grow
                            rows={10}
                            value={
                                descrizioneValue
                                    ? descrizioneValue
                                    : genericaDescrizione
                            }
                            onIonChange={(e) =>
                                changeImmobileValue(e, "descrizione")
                            }
                        ></IonTextarea>
                    </IonItem>
                </IonItemGroup>
                <IonButton
                    expand="block"
                    disabled={!isFormValid}
                    onClick={(e) => submitForm(e)}
                >
                    {props.immobile ? "Modifica" : "Aggiungi"} immobile
                </IonButton>
            </IonList>
        </form>
    );
};

export default ImmobileForm;

/* 
Fix title per piccoli schermi
Inserimento completato !!!
*/
