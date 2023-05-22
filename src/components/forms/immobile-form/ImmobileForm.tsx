import {
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonButton,
    IonLoading,
} from "@ionic/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Caratteristiche } from "../../../entities/caratteristiche.model";
import { Immobile } from "../../../entities/immobile.model";
import { Persona } from "../../../entities/persona.model";
import useInput from "../../../hooks/use-input";
import { possibiliAC } from "../../../types/aria_condizionata";
import { possibiliArredamenti } from "../../../types/arredamento";
import { possibiliBalconiTerrazzi } from "../../../types/balconi_terrazzi";
import { possibiliBox } from "../../../types/box";
import { possibleCategories } from "../../../types/categoria";
import { possibiliCategorieCatastali } from "../../../types/categoria_catastale";
import { possibleCitofoni } from "../../../types/citofono";
import { possibleEnergeticClasses } from "../../../types/classeEnergetica";
import { possibleCombustibili } from "../../../types/combustibile";
import { possibleComuni, possibleZona } from "../../../types/comuni";
import { possibleContratti } from "../../../types/contratto";
import { possibiliEsposizioni } from "../../../types/esposizione";
import { possibiliGiardini } from "../../../types/giardino";
import { possibiliImpianti } from "../../../types/impianto";
import { possibleLibero } from "../../../types/libero";
import { possibleLivelli } from "../../../types/livelli";
import { possibleLocali } from "../../../types/locali";
import { possiblePiano } from "../../../types/piano";
import { possiblePortineria } from "../../../types/portineria";
import { possibiliProprieta } from "../../../types/proprieta";
import { possibleRiscaldamenti } from "../../../types/riscaldamento";
import { possibleSerramentiEsterni } from "../../../types/serramenti_esterni";
import { possibleSerramentiInterni } from "../../../types/serramenti_interni";
import { possibleStato } from "../../../types/stato";
import { possibleStatus, status } from "../../../types/status";
import { possibleTipologies } from "../../../types/tipologia";
import axiosInstance from "../../../utils/axiosInstance";
import { capitalize } from "../../../utils/stringUtils";
import { genericaDescrizione } from "../../../utils/genericaDescrizione";
import FormGroup from "../../form-components/form-group/FormGroup";
import FormInputBoolean from "../../form-components/form-input-boolean/FormInputBoolean";
import FormSelect from "../../form-components/form-select/FormSelect";
import TextArea from "../../form-components/form-text-area/FormTextArea";
import FormInput from "../../form-components/form-input/FormInput";
import Modal from "../../modal/Modal";
import { possibiliTipiContratti } from "../../../types/tipo_contratti";
import { possibiliCauzioni } from "../../../types/cauzioni";
import ItemSelector from "../../form-components/item-selector/ItemSelector";
import { Entity } from "../../../entities/entity";
import Selector from "../../selector/Selector";
import SecondaryItem from "../../form-components/secondary-item/SecondaryItem";
import useList from "../../../hooks/use-list";
import { getPhoneValue } from "../../../utils/numberUtils";
import { navigateToSpecificItem } from "../../../utils/navUtils";
import { useNavigate } from "react-router-dom";
import useErrorHandler from "../../../hooks/use-error-handler";

const ImmobileForm: React.FC<{
    immobile: Immobile | null;
    backToList: () => void;
}> = (props) => {
    const navigate = useNavigate();

    const [isQuerySuccessfull, setIsQuerySuccessfull] =
        useState<boolean>(false);

    const [isAutomaticRef, setIsAutomaticRef] = useState<boolean | null>(
        !!!props.immobile
    );

    const { isError, presentAlert, hideAlert, errorHandler } =
        useErrorHandler();

    const [isManualTown, setIsManualTown] = useState<boolean>(
        !!props.immobile &&
            !!props.immobile.comune &&
            possibleComuni.find((el) => el === props.immobile!.comune) ===
                undefined
    );

    const {
        inputValue: inputRefValue,
        inputIsInvalid: inputRefIsInvalid,
        inputTouchedHandler: inputRefTouchedHandler,
        inputChangedHandler: inputRefChangedHandler,
        reset: inputRefReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile ? props.immobile.ref : undefined
    );

    const {
        inputValue: inputTitleValue,
        inputIsInvalid: inputTitleIsInvalid,
        inputTouchedHandler: inputTitleTouchedHandler,
        inputChangedHandler: inputTitleChangedHandler,
        reset: inputTitleReset,
    } = useInput(
        (el) => el.toString().length >= 15 && el.toString().length <= 60,
        props.immobile ? props.immobile.titolo : undefined
    );

    const {
        inputValue: inputSuperficieValue,
        inputIsInvalid: inputSuperficieIsInvalid,
        inputTouchedHandler: inputSuperficieTouchedHandler,
        inputChangedHandler: inputSuperficieChangedHandler,
        reset: inputSuperficieReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile ? props.immobile.superficie : undefined
    );

    const {
        inputValue: inputTipologiaValue,
        inputChangedHandler: inputTipologiaChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.tipologia : undefined
    );

    const {
        inputValue: inputLocaliValue,
        inputChangedHandler: inputLocaliChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.locali : undefined
    );

    const {
        inputValue: inputComuneValue,
        inputIsInvalid: inputComuneIsInvalid,
        inputTouchedHandler: inputComuneTouchedHandler,
        inputChangedHandler: inputComuneChangedHandler,
        reset: inputComuneReset,
    } = useInput(
        (el) => el.toString().length > 5,
        props.immobile ? props.immobile.comune : undefined
    );

    const {
        inputValue: inputZonaValue,
        inputChangedHandler: inputZonaChangedHandler,
    } = useInput(() => true, props.immobile ? props.immobile.zona : undefined);

    const {
        inputValue: inputIndirizzoValue,
        inputIsInvalid: inputIndirizzoIsInvalid,
        inputTouchedHandler: inputIndirizzoTouchedHandler,
        inputChangedHandler: inputIndirizzoChangedHandler,
        reset: inputIndirizzoReset,
    } = useInput(
        (el) => el.toString().length > 5,
        props.immobile ? props.immobile.indirizzo : undefined
    );

    const {
        inputValue: inputPrezzoValue,
        inputIsInvalid: inputPrezzoIsInvalid,
        inputTouchedHandler: inputPrezzoTouchedHandler,
        inputChangedHandler: inputPrezzoChangedHandler,
        reset: inputPrezzoReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile && props.immobile.prezzo
            ? +props.immobile.prezzo
            : undefined
    );

    const {
        inputValue: inputRiscaldamentoValue,
        inputChangedHandler: inputRiscaldamentoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.riscaldamento : undefined
    );

    const {
        inputValue: inputClasseEnergeticaValue,
        inputChangedHandler: inputClasseEnergeticaChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.classeEnergetica : undefined
    );

    const {
        inputValue: inputConsumoValue,
        inputIsInvalid: inputConsumoIsInvalid,
        inputTouchedHandler: inputConsumoTouchedHandler,
        inputChangedHandler: inputConsumoChangedHandler,
        reset: inputConsumoReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile ? props.immobile.consumo : undefined
    );

    const {
        inputValue: inputContrattoValue,
        inputChangedHandler: inputContrattoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.contratto : undefined
    );

    const {
        inputValue: inputCategoriaValue,
        inputChangedHandler: inputCategoriaChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.categoria : undefined
    );

    const {
        inputValue: inputStatoValue,
        inputChangedHandler: inputStatoChangedHandler,
    } = useInput(() => true, props.immobile ? props.immobile.stato : undefined);

    const {
        inputValue: inputLiberoValue,
        inputChangedHandler: inputLiberoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.libero : undefined
    );

    const {
        inputValue: inputStatusValue,
        inputChangedHandler: inputStatusChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.status : undefined
    );

    const {
        inputValue: inputPianoValue,
        inputChangedHandler: inputPianoChangedHandler,
    } = useInput(() => true, props.immobile ? props.immobile.piano : undefined);

    const {
        inputValue: inputTotalePianiValue,
        inputIsInvalid: inputTotalePianiIsInvalid,
        inputTouchedHandler: inputTotalePianiTouchedHandler,
        inputChangedHandler: inputTotalePianiChangedHandler,
        reset: inputTotalePianiReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile ? props.immobile.caratteristiche?.totalePiani : undefined
    );

    const {
        inputValue: inputDescrizioneValue,
        inputIsTouched: inputDescrizioneIsTouched,
        inputIsInvalid: inputDescrizioneIsInvalid,
        inputTouchedHandler: inputDescrizioneTouchedHandler,
        inputChangedHandler: inputDescrizioneChangedHandler,
        reset: inputDescrizioneReset,
    } = useInput(
        (el) =>
            el.toString().length > 100 &&
            el.toString().length < 2060 &&
            el.toString() !== genericaDescrizione,
        props.immobile
            ? props.immobile.caratteristiche?.descrizione
            : genericaDescrizione
    );

    const {
        inputValue: inputEsposizioneValue,
        inputChangedHandler: inputEsposizioneChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.esposizione : undefined
    );

    const {
        inputValue: inputSpeseCondominialiValue,
        inputIsInvalid: inputSpeseCondominialiIsInvalid,
        inputTouchedHandler: inputSpeseCondominialiTouchedHandler,
        inputChangedHandler: inputSpeseCondominialiChangedHandler,
        reset: inputSpeseCondominialiReset,
    } = useInput(
        (el) => (el as number) > 0,
        props.immobile
            ? props.immobile.caratteristiche?.speseCondominiali
            : undefined
    );

    const {
        inputValue: inputSpeseExtraValue,
        inputIsInvalid: inputSpeseExtraIsInvalid,
        inputTouchedHandler: inputSpeseExtraTouchedHandler,
        inputChangedHandler: inputSpeseExtraChangedHandler,
        reset: inputSpeseExtraReset,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.speseExtraNote
            : undefined
    );

    const [isCantina, setIsCantina] = useState<boolean>(!!props.immobile);

    const [isMansarda, setIsMansarda] = useState<boolean>(!!props.immobile);

    const [isTaverna, setIsTaverna] = useState<boolean>(!!props.immobile);

    const [isAntifurto, setIsAntifurto] = useState<boolean>(!!props.immobile);

    const [isSpeseCondominiali, setIsSpeseCondominiali] = useState<boolean>(
        !!props.immobile
    );

    const [isSpeseExtra, setIsSpeseExtra] = useState<boolean>(!!props.immobile);

    const [inputAscensoreValue, setInputAscensoreValue] = useState<boolean>(
        props.immobile &&
            props.immobile.caratteristiche &&
            props.immobile.caratteristiche.ascensore
            ? props.immobile.caratteristiche.ascensore
            : false
    );

    const {
        inputValue: inputArredamentoValue,
        inputChangedHandler: inputArredamentoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.arredamento : undefined
    );

    const {
        inputValue: inputBalconiValue,
        inputChangedHandler: inputBalconiChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.balconi : undefined
    );

    const {
        inputValue: inputTerrazziValue,
        inputChangedHandler: inputTerrazziChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.terrazzi : undefined
    );

    const {
        inputValue: inputBoxValue,
        inputChangedHandler: inputBoxChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.box : undefined
    );

    const {
        inputValue: inputGiardinoValue,
        inputChangedHandler: inputGiardinoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.giardino : undefined
    );

    const {
        inputValue: inputTavernaValue,
        inputIsInvalid: inputTavernaIsInvalid,
        inputTouchedHandler: inputTavernaTouchedHandler,
        inputChangedHandler: inputTavernaChangedHandler,
        reset: inputTavernaReset,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.taverna : undefined
    );

    const {
        inputValue: inputMansardaValue,
        inputIsInvalid: inputMansardaIsInvalid,
        inputTouchedHandler: inputMansardaTouchedHandler,
        inputChangedHandler: inputMansardaChangedHandler,
        reset: inputMansardaReset,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.mansarda : undefined
    );

    const {
        inputValue: inputCantinaValue,
        inputIsInvalid: inputCantinaIsInvalid,
        inputTouchedHandler: inputCantinaTouchedHandler,
        inputChangedHandler: inputCantinaChangedHandler,
        reset: inputCantinaReset,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.cantina : undefined
    );

    const {
        inputValue: inputSpeseRiscaldamentoValue,
        inputIsInvalid: inputSpeseRiscaldamentoIsInvalid,
        inputTouchedHandler: inputSpeseRiscaldamentoTouchedHandler,
        inputChangedHandler: inputSpeseRiscaldamentoChangedHandler,
        reset: inputSpeseRiscaldamentoReset,
    } = useInput(
        (el) => true,
        props.immobile
            ? props.immobile.caratteristiche?.speseRiscaldamento
            : undefined
    );

    const {
        inputValue: inputAriaCondizionataValue,
        inputChangedHandler: inputAriaCondizionataChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.ariaCondizionata
            : undefined
    );

    const {
        inputValue: inputProprietaValue,
        inputChangedHandler: inputProprietaChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.proprieta : undefined
    );

    const {
        inputValue: inputCategoriaCatastaleValue,
        inputChangedHandler: inputCategoriaCatastaleChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.categoriaCatastale
            : undefined
    );

    const {
        inputValue: inputRenditaValue,
        inputIsInvalid: inputRenditaIsInvalid,
        inputTouchedHandler: inputRenditaTouchedHandler,
        inputChangedHandler: inputRenditaChangedHandler,
        reset: inputRenditaReset,
    } = useInput(
        (el) => true,
        props.immobile ? props.immobile.caratteristiche?.rendita : undefined
    );

    const {
        inputValue: inputImpiantoElettricoValue,
        inputChangedHandler: inputImpiantoElettricoChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.impiantoElettrico
            : undefined
    );

    const {
        inputValue: inputImpiantoIdraulicoValue,
        inputChangedHandler: inputImpiantoIdraulicoChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.impiantoIdraulico
            : undefined
    );

    const {
        inputValue: inputLivelliValue,
        inputChangedHandler: inputLivelliChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.livelli : undefined
    );

    const {
        inputValue: inputSerramentiInterniValue,
        inputChangedHandler: inputSerramentiInterniChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.serramentiInterni
            : undefined
    );

    const {
        inputValue: inputSerramentiEsterniValue,
        inputChangedHandler: inputSerramentiEsterniChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.serramentiEsterni
            : undefined
    );

    const [inputPortaBlindataValue, setInputPortaBlindataValue] =
        useState<boolean>(
            props.immobile &&
                props.immobile.caratteristiche &&
                props.immobile.caratteristiche.portaBlindata
                ? props.immobile.caratteristiche.portaBlindata
                : false
        );

    const {
        inputValue: inputAntifurtoValue,
        inputIsInvalid: inputAntifurtoIsInvalid,
        inputTouchedHandler: inputAntifurtoTouchedHandler,
        inputChangedHandler: inputAntifurtoChangedHandler,
        reset: inputAntifurtoReset,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.antifurto : undefined
    );

    const {
        inputValue: inputCitofonoValue,
        inputChangedHandler: inputCitofonoChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.citofono : undefined
    );

    const {
        inputValue: inputAnnoCostruzioneValue,
        inputIsInvalid: inputAnnoCostruzioneIsInvalid,
        inputTouchedHandler: inputAnnoCostruzioneTouchedHandler,
        inputChangedHandler: inputAnnoCostruzioneChangedHandler,
        reset: inputAnnoCostruzioneReset,
    } = useInput(
        (el) =>
            (el as number) >= 1800 &&
            (el as number) <= new Date().getFullYear(),
        props.immobile
            ? props.immobile.caratteristiche?.annoCostruzione
            : undefined
    );

    const {
        inputValue: inputPortineriaValue,
        inputChangedHandler: inputPortineriaChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.portineria : undefined
    );

    const {
        inputValue: inputCombustibileValue,
        inputChangedHandler: inputCombustibileChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.combustibile
            : undefined
    );

    const {
        inputValue: inputCablatoValue,
        inputIsInvalid: inputCablatoIsInvalid,
        inputTouchedHandler: inputCablatoTouchedHandler,
        inputChangedHandler: inputCablatoChangedHandler,
        reset: inputCablatoReset,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.cablato : undefined
    );

    const {
        inputValue: inputTipoContrattoValue,
        inputChangedHandler: inputTipoContrattoChangedHandler,
    } = useInput(
        () => true,
        props.immobile
            ? props.immobile.caratteristiche?.tipoContratto
            : undefined
    );

    const {
        inputValue: inputCauzioneValue,
        inputChangedHandler: inputCauzioneChangedHandler,
    } = useInput(
        () => true,
        props.immobile ? props.immobile.caratteristiche?.cauzione : undefined
    );

    const {
        inputValue: inputAltezzaValue,
        inputIsInvalid: inputAltezzaIsInvalid,
        inputTouchedHandler: inputAltezzaTouchedHandler,
        inputChangedHandler: inputAltezzaChangedHandler,
        reset: inputAltezzaReset,
    } = useInput(
        (el) => (el as number) >= 1,
        props.immobile ? props.immobile.caratteristiche?.altezza : undefined
    );

    const {
        inputValue: inputNameValue,
        inputIsInvalid: inputNameIsInvalid,
        inputTouchedHandler: inputNameTouchedHandler,
        inputChangedHandler: inputNameChangedHandler,
        reset: inputNameReset,
    } = useInput((el) => !!el && el.toString().trim().length > 4);

    const {
        inputValue: inputPhoneValue,
        inputIsInvalid: inputPhoneIsInvalid,
        inputTouchedHandler: inputPhoneTouchedHandler,
        inputChangedHandler: inputPhoneChangedHandler,
        reset: inputPhoneReset,
    } = useInput(() => true);

    const {
        inputValue: inputEmailValue,
        inputIsInvalid: inputEmailIsInvalid,
        inputTouchedHandler: inputEmailTouchedHandler,
        inputChangedHandler: inputEmailChangedHandler,
        reset: inputEmailReset,
    } = useInput(
        (el) =>
            !el ||
            el.toString().trim().length === 0 ||
            /.+@.+\..+/.test(el.toString())
    );

    const getErrorDescrizione = () => {
        if (!inputDescrizioneIsTouched && !props.immobile) return "DA CAMBIARE";
        if (!inputDescrizioneIsInvalid) return "";
        return `TROPPO ${
            inputDescrizioneValue.toString().length < 100 ? "CORTA" : "LUNGA"
        }`;
    };

    useEffect(() => {
        if (!isSpeseExtra) inputSpeseExtraChangedHandler("");
    }, [isSpeseExtra, inputSpeseExtraChangedHandler]);

    useEffect(() => {
        if (!isSpeseCondominiali) inputSpeseCondominialiChangedHandler(null);
    }, [isSpeseCondominiali, inputSpeseCondominialiChangedHandler]);

    useEffect(() => {
        if (!isAntifurto) inputAntifurtoChangedHandler("");
    }, [isAntifurto, inputAntifurtoChangedHandler]);

    useEffect(() => {
        if (!isTaverna) inputTavernaChangedHandler("");
    }, [isTaverna, inputTavernaChangedHandler]);

    useEffect(() => {
        if (!isMansarda) inputMansardaChangedHandler("");
    }, [isMansarda, inputMansardaChangedHandler]);

    useEffect(() => {
        if (!isCantina) inputCantinaChangedHandler("");
    }, [isCantina, inputCantinaChangedHandler]);

    const [showLoading, setShowLoading] = useState<boolean>(true);

    const [proprietarioValue, setProprietarioValue] = useState<Persona | null>(
        null
    );

    const [inquiliniValue, setInquiliniValue] = useState<Persona[]>([]);

    const [caratteristicheFetched, setCaratteristicheFetched] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchCaratteristiche = async () => {
            setCaratteristicheFetched(true);
            try {
                const res = await axiosInstance.get(
                    `/immobili/${props.immobile!.id}`
                );
                setProprietarioValue(res.data.proprietario);
                setInquiliniValue(res.data.inquilini);
                const caratteristiche = res.data.caratteristicheImmobile;
                setShowLoading(false);
                setIsCantina(
                    caratteristiche &&
                        caratteristiche.cantina &&
                        caratteristiche.cantina !== "Assente"
                );
                setIsMansarda(
                    caratteristiche &&
                        caratteristiche.mansarda &&
                        caratteristiche.mansarda !== "Assente"
                );
                setIsTaverna(
                    caratteristiche &&
                        caratteristiche.taverna &&
                        caratteristiche.taverna !== "Assente"
                );
                setIsAntifurto(
                    caratteristiche &&
                        caratteristiche.antifurto &&
                        caratteristiche.antifurto !== "Assente"
                );
                setIsSpeseCondominiali(
                    caratteristiche && !!caratteristiche.speseCondominiali
                );
                setIsSpeseExtra(
                    caratteristiche &&
                        caratteristiche.speseExtraNote &&
                        caratteristiche.speseExtraNote !==
                            "Spese Extra non previste"
                );
                inputDescrizioneChangedHandler(
                    null,
                    caratteristiche.descrizione
                );
                inputEsposizioneChangedHandler(
                    null,
                    caratteristiche.esposizione
                );
                inputSpeseCondominialiChangedHandler(
                    null,
                    caratteristiche.speseCondominiali
                );
                inputSpeseExtraChangedHandler(
                    null,
                    caratteristiche.speseExtraNote
                );
                setInputAscensoreValue(caratteristiche.ascensore);
                inputArredamentoChangedHandler(
                    null,
                    caratteristiche.arredamento
                );
                inputBalconiChangedHandler(null, caratteristiche.balconi);
                inputTerrazziChangedHandler(null, caratteristiche.terrazzi);
                inputBoxChangedHandler(null, caratteristiche.box);
                inputGiardinoChangedHandler(null, caratteristiche.giardino);
                inputTavernaChangedHandler(null, caratteristiche.taverna);
                inputMansardaChangedHandler(null, caratteristiche.mansarda);
                inputCantinaChangedHandler(null, caratteristiche.cantina);
                inputSpeseRiscaldamentoChangedHandler(
                    null,
                    caratteristiche.speseRiscaldamento
                );
                inputAriaCondizionataChangedHandler(
                    null,
                    caratteristiche.ariaCondizionata
                );
                inputProprietaChangedHandler(null, caratteristiche.proprieta);
                inputCategoriaCatastaleChangedHandler(
                    null,
                    caratteristiche.categoriaCatastale
                );
                inputRenditaChangedHandler(null, caratteristiche.rendita);
                inputImpiantoElettricoChangedHandler(
                    null,
                    caratteristiche.impiantoElettrico
                );
                inputImpiantoIdraulicoChangedHandler(
                    null,
                    caratteristiche.impiantoIdraulico
                );
                inputLivelliChangedHandler(null, caratteristiche.livelli);
                inputSerramentiInterniChangedHandler(
                    null,
                    caratteristiche.serramentiInterni
                );
                inputSerramentiEsterniChangedHandler(
                    null,
                    caratteristiche.serramentiEsterni
                );
                setInputPortaBlindataValue(caratteristiche.portaBlindata);
                inputAntifurtoChangedHandler(null, caratteristiche.antifurto);
                inputCitofonoChangedHandler(null, caratteristiche.citofono);
                inputAnnoCostruzioneChangedHandler(
                    null,
                    caratteristiche.annoCostruzione
                );
                inputPortineriaChangedHandler(null, caratteristiche.portineria);
                inputCombustibileChangedHandler(
                    null,
                    caratteristiche.combustibile
                );
                inputCablatoChangedHandler(null, caratteristiche.cablato);
                inputTipoContrattoChangedHandler(
                    null,
                    caratteristiche.tipoContratto
                );
                inputCauzioneChangedHandler(null, caratteristiche.cauzione);
                inputAltezzaChangedHandler(null, caratteristiche.altezza);
                inputTotalePianiChangedHandler(
                    null,
                    caratteristiche.totalePiani
                );
            } catch (e) {
                setShowLoading(false);
                errorHandler(e, "Immobile impossibile da aprire");
            }
        };
        props.immobile && !caratteristicheFetched
            ? fetchCaratteristiche()
            : setShowLoading(false);
    }, [
        props.immobile,
        errorHandler,
        presentAlert,
        inputAltezzaChangedHandler,
        inputAnnoCostruzioneChangedHandler,
        inputAntifurtoChangedHandler,
        inputAriaCondizionataChangedHandler,
        inputArredamentoChangedHandler,
        inputBalconiChangedHandler,
        inputTerrazziChangedHandler,
        inputBoxChangedHandler,
        inputCablatoChangedHandler,
        inputCantinaChangedHandler,
        inputCategoriaCatastaleChangedHandler,
        inputCauzioneChangedHandler,
        inputCitofonoChangedHandler,
        inputCombustibileChangedHandler,
        inputDescrizioneChangedHandler,
        inputEsposizioneChangedHandler,
        inputGiardinoChangedHandler,
        inputImpiantoElettricoChangedHandler,
        inputImpiantoIdraulicoChangedHandler,
        inputLivelliChangedHandler,
        inputMansardaChangedHandler,
        inputPortineriaChangedHandler,
        inputProprietaChangedHandler,
        inputRenditaChangedHandler,
        inputSerramentiEsterniChangedHandler,
        inputSerramentiInterniChangedHandler,
        inputSpeseCondominialiChangedHandler,
        inputSpeseExtraChangedHandler,
        inputSpeseRiscaldamentoChangedHandler,
        inputTavernaChangedHandler,
        inputTipoContrattoChangedHandler,
        inputTotalePianiChangedHandler,
        caratteristicheFetched,
        setCaratteristicheFetched,
    ]);

    const [newProprietarioPartOpened, setNewProprietarioPartOpened] =
        useState<boolean>(false);

    const isFormInvalid =
        !inputTitleValue ||
        inputTitleIsInvalid ||
        !inputSuperficieValue ||
        inputSuperficieIsInvalid ||
        !inputTipologiaValue ||
        !inputLocaliValue ||
        !inputComuneValue ||
        !inputIndirizzoValue ||
        !inputPrezzoValue ||
        inputPrezzoIsInvalid ||
        !inputRiscaldamentoValue ||
        !inputClasseEnergeticaValue ||
        inputConsumoIsInvalid ||
        !inputContrattoValue ||
        !inputCategoriaValue ||
        !inputStatoValue ||
        !inputStatusValue ||
        !inputLiberoValue ||
        !inputPianoValue ||
        inputSpeseCondominialiIsInvalid ||
        inputSpeseRiscaldamentoIsInvalid ||
        inputRenditaIsInvalid ||
        inputAnnoCostruzioneIsInvalid ||
        inputDescrizioneIsInvalid ||
        (!props.immobile && !inputDescrizioneIsTouched) ||
        (newProprietarioPartOpened && inputNameIsInvalid) ||
        (newProprietarioPartOpened && inputPhoneIsInvalid) ||
        (newProprietarioPartOpened && inputEmailIsInvalid);

    const getSubmitText = () => {
        if (!inputTitleValue) return "Titolo campo obbligatorio";
        if (inputTitleIsInvalid) return "Titolo da correggere";
        if (!inputSuperficieValue) return "Superficie campo obbligatorio";
        if (inputSuperficieIsInvalid) return "Superficie da correggere";
        if (!inputTipologiaValue) return "Tipologia campo obbligatorio";
        if (!inputLocaliValue) return "Locali campo obbligatorio";
        if (!inputComuneValue) return "Comune campo obbligatorio";
        if (!inputIndirizzoValue) return "Indirizzo campo obbligatorio";
        if (!inputPrezzoValue) return "Prezzo campo obbligatorio";
        if (inputPrezzoIsInvalid) return "Prezzo da correggere";
        if (!inputRiscaldamentoValue) return "Riscaldamento campo obbligatorio";
        if (!inputClasseEnergeticaValue)
            return "Classe Energetica campo obbligatorio";
        if (inputConsumoIsInvalid) return "Consumo da correggere";
        if (!inputContrattoValue) return "Contratto campo obbligatorio";
        if (!inputCategoriaValue) return "Categoria campo obbligatorio";
        if (!inputStatoValue) return "Stato campo obbligatorio";
        if (!inputStatusValue) return "Status campo obbligatorio";
        if (!inputLiberoValue) return "Libero campo obbligatorio";
        if (!inputPianoValue) return "Piano campo obbligatorio";
        if (inputSpeseCondominialiIsInvalid)
            return "Spese condominiali da correggere";
        if (inputSpeseRiscaldamentoIsInvalid)
            return "Spese riscaldamento da correggere";
        if (inputRenditaIsInvalid) return "Rendita da correggere";
        if (inputAnnoCostruzioneIsInvalid)
            return "Anno di costruzione da correggere";
        if (inputDescrizioneIsInvalid)
            return inputDescrizioneValue.toString().length < 100
                ? "Descrizione troppo corta"
                : "Descrizione troppo lunga";
        if (!props.immobile && !inputDescrizioneIsTouched)
            return "Descrizione da cambiare";
        return `${props.immobile ? "Modifica" : "Aggiungi"} immobile`;
    };

    const getProprietario = useCallback(() => {
        // if newpart is open create new object
        if (newProprietarioPartOpened) {
            return {
                nome:
                    inputNameValue && inputNameValue.trim().length > 0
                        ? inputNameValue
                        : null,
                telefono: getPhoneValue(inputPhoneValue),
                email:
                    inputEmailValue && inputEmailValue.trim().length > 0
                        ? inputEmailValue
                        : null,
            };
        } else {
            return proprietarioValue ? proprietarioValue : null;
        }
    }, [
        newProprietarioPartOpened,
        inputNameValue,
        inputPhoneValue,
        inputEmailValue,
        proprietarioValue,
    ]);

    const getComuneValue = useCallback(() => {
        if (!isManualTown || !inputComuneValue) return inputComuneValue;
        let output = inputComuneValue;
        possibleComuni.forEach((el) => {
            if (
                el.toLowerCase().trim() ===
                inputComuneValue.toLowerCase().trim()
            ) {
                output = el;
            }
        });
        return output;
    }, [inputComuneValue, isManualTown]);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const immobile = new Immobile(
            null,
            isAutomaticRef ? null : inputRefValue,
            inputTitleValue,
            inputSuperficieValue,
            null,
            inputTipologiaValue,
            inputLocaliValue,
            inputIndirizzoValue,
            inputZonaValue ? inputZonaValue : "",
            getComuneValue(),
            inputPrezzoValue
                ? +inputPrezzoValue.toString().replace(".", "")
                : null,
            inputRiscaldamentoValue,
            inputClasseEnergeticaValue,
            inputConsumoValue,
            inputContrattoValue,
            inputCategoriaValue,
            inputStatoValue,
            inputLiberoValue,
            inputStatusValue
                ? (capitalize(inputStatusValue.toLowerCase()) as status)
                : null,
            inputPianoValue,
            null,
            null,
            null,
            inquiliniValue
        );
        const caratteristicheImmobile = new Caratteristiche(
            null,
            inputDescrizioneValue,
            inputEsposizioneValue,
            inputSpeseCondominialiValue
                ? +inputSpeseCondominialiValue
                      .toString()
                      .split(".")[0]
                      .split(",")[0]
                : 0,
            inputSpeseExtraValue
                ? inputSpeseExtraValue
                : "Spese Extra non previste",
            inputAscensoreValue,
            inputArredamentoValue,
            inputBalconiValue,
            inputTerrazziValue,
            inputBoxValue,
            inputGiardinoValue,
            inputTavernaValue ? inputTavernaValue : "Assente",
            inputMansardaValue ? inputMansardaValue : "Assente",
            inputCantinaValue ? inputCantinaValue : "Assente",
            inputSpeseRiscaldamentoValue,
            inputAriaCondizionataValue,
            inputProprietaValue,
            inputCategoriaCatastaleValue,
            inputRenditaValue,
            inputImpiantoElettricoValue,
            inputImpiantoIdraulicoValue,
            inputLivelliValue,
            inputSerramentiInterniValue,
            inputSerramentiEsterniValue,
            inputPortaBlindataValue,
            inputAntifurtoValue ? inputAntifurtoValue : "Assente",
            inputCitofonoValue,
            inputAnnoCostruzioneValue,
            inputPortineriaValue,
            inputCombustibileValue,
            inputCablatoValue,
            inputTipoContrattoValue,
            inputCauzioneValue,
            inputAltezzaValue,
            inputTotalePianiValue
        );
        setShowLoading(true);
        const reqBody = {
            immobile,
            proprietario: getProprietario(),
            caratteristicheImmobile,
        };

        try {
            const res = props.immobile
                ? await axiosInstance.patch(
                      `immobili/${props.immobile!.id}`,
                      reqBody
                  )
                : await axiosInstance.post(`immobili`, reqBody);
            setShowLoading(false);
            setIsQuerySuccessfull(true);
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
            errorHandler(error, "Procedura non riuscita");
        }
    };

    const deletePersona = (id: number, mode: "proprietario" | "inquilino") => {
        setCurrentPersona(null);
        if (mode === "inquilino") {
            setInquiliniValue((prevList) => {
                return prevList.filter((el) => el.id! !== id);
            });
        } else if (mode === "proprietario") {
            setProprietarioValue(null);
        }
    };

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const [choiceMode, setChoiceMode] = useState<
        "proprietario" | "inquilino" | null
    >(null);

    // persona che viene definita nel selector
    const [currentPersona, setCurrentPersona] = useState<Entity | null>(null);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (choiceMode === "proprietario" && currentPersona) {
                setProprietarioValue(currentPersona as Persona);
                setModalIsOpen(false);
                setCurrentPersona(null);
            } else if (choiceMode === "inquilino" && currentPersona) {
                const itemAlreadyPresent = inquiliniValue.find(
                    (el) => el.id === currentPersona.id
                );
                if (!itemAlreadyPresent)
                    setInquiliniValue((prevList) => [
                        currentPersona as Persona,
                        ...prevList,
                    ]);
                setModalIsOpen(false);
                setCurrentPersona(null);
            }
        }, 300);
        return () => clearTimeout(timeOut);
    }, [currentPersona, choiceMode, inquiliniValue]);

    const openModal = (type: "proprietario" | "inquilino") => {
        setChoiceMode(type);
        setCurrentPersona(null);
        setModalIsOpen(true);
    };

    const {
        list: listSecondaryItems,
        closeItemsList: closeSecondaryItemsList,
    } = useList();

    useEffect(() => {
        if (!newProprietarioPartOpened) {
            inputNameReset();
            inputPhoneReset();
            inputEmailReset();
        }
    }, [
        newProprietarioPartOpened,
        inputNameReset,
        inputPhoneReset,
        inputEmailReset,
    ]);

    const { immobile, backToList } = props;

    useEffect(() => {
        const isFormInvalid =
            !inputTitleValue ||
            inputTitleIsInvalid ||
            !inputSuperficieValue ||
            inputSuperficieIsInvalid ||
            !inputTipologiaValue ||
            !inputLocaliValue ||
            !inputComuneValue ||
            !inputIndirizzoValue ||
            !inputPrezzoValue ||
            inputPrezzoIsInvalid ||
            !inputRiscaldamentoValue ||
            !inputClasseEnergeticaValue ||
            inputConsumoIsInvalid ||
            !inputContrattoValue ||
            !inputCategoriaValue ||
            !inputStatoValue ||
            !inputStatusValue ||
            !inputLiberoValue ||
            !inputPianoValue ||
            inputSpeseCondominialiIsInvalid ||
            inputSpeseRiscaldamentoIsInvalid ||
            inputRenditaIsInvalid ||
            inputAnnoCostruzioneIsInvalid ||
            inputDescrizioneIsInvalid ||
            (!immobile && !inputDescrizioneIsTouched) ||
            (newProprietarioPartOpened && inputNameIsInvalid) ||
            (newProprietarioPartOpened && inputPhoneIsInvalid) ||
            (newProprietarioPartOpened && inputEmailIsInvalid);

        const eseguiForm = async () => {
            const newImmobile = new Immobile(
                null,
                isAutomaticRef ? null : inputRefValue,
                inputTitleValue,
                inputSuperficieValue,
                null,
                inputTipologiaValue,
                inputLocaliValue,
                inputIndirizzoValue,
                inputZonaValue ? inputZonaValue : "",
                getComuneValue(),
                inputPrezzoValue
                    ? +inputPrezzoValue.toString().replace(".", "")
                    : null,
                inputRiscaldamentoValue,
                inputClasseEnergeticaValue,
                inputConsumoValue,
                inputContrattoValue,
                inputCategoriaValue,
                inputStatoValue,
                inputLiberoValue,
                inputStatusValue
                    ? (capitalize(inputStatusValue.toLowerCase()) as status)
                    : null,
                inputPianoValue,
                null,
                null,
                null,
                inquiliniValue
            );
            const caratteristicheImmobile = new Caratteristiche(
                null,
                inputDescrizioneValue,
                inputEsposizioneValue,
                inputSpeseCondominialiValue
                    ? +inputSpeseCondominialiValue
                          .toString()
                          .split(".")[0]
                          .split(",")[0]
                    : 0,
                inputSpeseExtraValue
                    ? inputSpeseExtraValue
                    : "Spese Extra non previste",
                inputAscensoreValue,
                inputArredamentoValue,
                inputBalconiValue,
                inputTerrazziValue,
                inputBoxValue,
                inputGiardinoValue,
                inputTavernaValue ? inputTavernaValue : "Assente",
                inputMansardaValue ? inputMansardaValue : "Assente",
                inputCantinaValue ? inputCantinaValue : "Assente",
                inputSpeseRiscaldamentoValue,
                inputAriaCondizionataValue,
                inputProprietaValue,
                inputCategoriaCatastaleValue,
                inputRenditaValue,
                inputImpiantoElettricoValue,
                inputImpiantoIdraulicoValue,
                inputLivelliValue,
                inputSerramentiInterniValue,
                inputSerramentiEsterniValue,
                inputPortaBlindataValue,
                inputAntifurtoValue ? inputAntifurtoValue : "Assente",
                inputCitofonoValue,
                inputAnnoCostruzioneValue,
                inputPortineriaValue,
                inputCombustibileValue,
                inputCablatoValue,
                inputTipoContrattoValue,
                inputCauzioneValue,
                inputAltezzaValue,
                inputTotalePianiValue
            );
            setShowLoading(true);
            const reqBody = {
                immobile: newImmobile,
                proprietario: getProprietario(),
                caratteristicheImmobile,
            };

            try {
                const res = immobile
                    ? await axiosInstance.patch(
                          `immobili/${immobile!.id}`,
                          reqBody
                      )
                    : await axiosInstance.post(`immobili`, reqBody);
                setShowLoading(false);
                setIsQuerySuccessfull(true);
                presentAlert({
                    header: "Ottimo",
                    subHeader: `Immobile ${immobile ? "modificato" : "creato"}`,
                    message: `Riferimento: ${res.data.ref}`,
                    buttons: [
                        {
                            text: "OK",
                            handler: () => backToList(),
                        },
                    ],
                });
            } catch (error: any) {
                setShowLoading(false);
                errorHandler(error, "Procedura non riuscita");
            }
        };

        const submitFormIfValid = async (e: KeyboardEvent) => {
            if (e.key === "Enter" && !isError) {
                if (!isFormInvalid && isQuerySuccessfull) {
                    hideAlert();
                    backToList();
                } else if (!isFormInvalid && !isQuerySuccessfull) {
                    if (document.activeElement instanceof HTMLElement)
                        document.activeElement.blur();
                    await eseguiForm();
                }
            }
        };

        window.addEventListener("keydown", submitFormIfValid);
        return () => {
            window.removeEventListener("keydown", submitFormIfValid);
        };
    }, [
        presentAlert,
        getComuneValue,
        getProprietario,
        hideAlert,
        errorHandler,
        isError,
        inputAltezzaValue,
        inputAnnoCostruzioneIsInvalid,
        inputAnnoCostruzioneValue,
        inputAntifurtoValue,
        inputAriaCondizionataValue,
        inputArredamentoValue,
        inputAscensoreValue,
        inputBalconiValue,
        inputBoxValue,
        inputCablatoValue,
        inputCantinaValue,
        inputCategoriaCatastaleValue,
        inputCategoriaValue,
        inputCauzioneValue,
        inputCitofonoValue,
        inputClasseEnergeticaValue,
        inputCombustibileValue,
        inputComuneValue,
        inputConsumoIsInvalid,
        inputConsumoValue,
        inputContrattoValue,
        inputDescrizioneIsInvalid,
        inputDescrizioneIsTouched,
        inputDescrizioneValue,
        inputEmailIsInvalid,
        inputEsposizioneValue,
        inputIndirizzoValue,
        inputLiberoValue,
        inputLivelliValue,
        inputPrezzoIsInvalid,
        inputPrezzoValue,
        inputGiardinoValue,
        inputImpiantoElettricoValue,
        inputImpiantoIdraulicoValue,
        inputLocaliValue,
        inputMansardaValue,
        inputNameIsInvalid,
        inputRefValue,
        inputRenditaIsInvalid,
        inputSuperficieValue,
        inputTavernaValue,
        inputZonaValue,
        inquiliniValue,
        isAutomaticRef,
        inputSpeseExtraValue,
        newProprietarioPartOpened,
        inputTipoContrattoValue,
        inputSpeseRiscaldamentoIsInvalid,
        inputSpeseRiscaldamentoValue,
        inputTotalePianiValue,
        isQuerySuccessfull,
        inputSpeseCondominialiIsInvalid,
        inputRiscaldamentoValue,
        inputSerramentiEsterniValue,
        inputSerramentiInterniValue,
        inputTitleIsInvalid,
        inputTitleValue,
        inputPhoneIsInvalid,
        inputPianoValue,
        inputPortaBlindataValue,
        inputPortineriaValue,
        inputProprietaValue,
        inputSpeseCondominialiValue,
        inputStatoValue,
        inputSuperficieIsInvalid,
        inputTerrazziValue,
        inputTipologiaValue,
        inputRenditaValue,
        inputStatusValue,
        immobile,
        backToList,
    ]);

    const getPersone = (type: "proprietario" | "inquilino") => {
        let list: Persona[] = [];
        if (type === "proprietario" && proprietarioValue) {
            list = [proprietarioValue];
        } else if (type === "inquilino") {
            list = inquiliniValue;
        }
        const renderList = list.map((el) => (
            <SecondaryItem
                closeItems={closeSecondaryItemsList}
                key={el!.id}
                deleteAction={() => {
                    deletePersona(el!.id!, type);
                    if (type === "proprietario")
                        setNewProprietarioPartOpened(false);
                }}
                visualizeAction={() =>
                    navigateToSpecificItem(
                        "persone",
                        el!.id!.toString(),
                        navigate
                    )
                }
            >
                <IonLabel text-wrap>
                    <h2>{capitalize(el.nome!)}</h2>
                    <h3>
                        {!el.telefono && "Telefono mancante"}
                        {el.telefono && (
                            <a href={`tel:${el.telefono}`}>{el.telefono}</a>
                        )}
                    </h3>
                    <h3>
                        {!el.email && "Email mancante"}
                        {el.email && (
                            <a href={`mailto:${el.email}`}>{el.email}</a>
                        )}
                    </h3>
                </IonLabel>
            </SecondaryItem>
        ));
        return (
            <IonList
                style={{ padding: "0", margin: "0" }}
                ref={listSecondaryItems}
            >
                {renderList}
            </IonList>
        );
    };

    useEffect(() => {
        if (inputComuneValue === "notInList") {
            inputComuneReset();
            setIsManualTown(true);
        }
    }, [inputComuneValue, inputComuneReset]);

    return (
        <form className="form">
            <IonLoading cssClass="loader" isOpen={showLoading} />
            <IonList className="list">
                <FormGroup title="Dati Base - Obbligatori">
                    {!props.immobile && (
                        <FormInputBoolean
                            condition={isAutomaticRef}
                            setCondition={setIsAutomaticRef}
                            sentence="Riferimento assegnato in automatico"
                        />
                    )}
                    {(props.immobile || !isAutomaticRef) && (
                        <FormInput
                            title="Riferimento"
                            inputValue={inputRefValue}
                            type={"number"}
                            inputIsInvalid={inputRefIsInvalid}
                            inputChangeHandler={inputRefChangedHandler}
                            inputTouchHandler={inputRefTouchedHandler}
                            errorMessage="Il riferimento deve essere maggiore di 0"
                            reset={inputRefReset}
                        />
                    )}
                    <FormInput
                        autofocus
                        title={"Titolo (tra 15 e 60 lettere)"}
                        inputValue={inputTitleValue}
                        type={"text"}
                        inputIsInvalid={inputTitleIsInvalid}
                        inputChangeHandler={inputTitleChangedHandler}
                        inputTouchHandler={inputTitleTouchedHandler}
                        errorMessage={`${inputTitleValue.length} lettere: lunghezza non valida`}
                        reset={inputTitleReset}
                    />
                    <FormInput
                        title={"Superficie in metri quadri"}
                        inputValue={inputSuperficieValue}
                        type={"number"}
                        inputIsInvalid={inputSuperficieIsInvalid}
                        inputChangeHandler={inputSuperficieChangedHandler}
                        inputTouchHandler={inputSuperficieTouchedHandler}
                        errorMessage={
                            "La superficie deve essere maggiore di 0 metri quadri"
                        }
                        reset={inputSuperficieReset}
                    />
                    <FormSelect
                        title="Tipologia"
                        value={inputTipologiaValue}
                        function={inputTipologiaChangedHandler}
                        possibleValues={possibleTipologies}
                    />
                    <FormSelect
                        title="Locali"
                        value={inputLocaliValue}
                        function={inputLocaliChangedHandler}
                        possibleValues={possibleLocali}
                    />
                    {!isManualTown && (
                        <IonItem>
                            <IonLabel position="floating">Comune</IonLabel>
                            <IonSelect
                                cancelText="Torna Indietro"
                                mode="ios"
                                interface="action-sheet"
                                value={inputComuneValue}
                                onIonChange={inputComuneChangedHandler}
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
                        <FormInput
                            title={"Comune"}
                            inputValue={inputComuneValue}
                            type={"text"}
                            inputIsInvalid={inputComuneIsInvalid}
                            inputChangeHandler={inputComuneChangedHandler}
                            inputTouchHandler={inputComuneTouchedHandler}
                            errorMessage={"Lunghezza non valida"}
                            reset={() => {
                                inputComuneReset();
                                setIsManualTown(false);
                            }}
                        />
                    )}
                    {(inputComuneValue === "Segrate" ||
                        inputComuneValue === "Milano") && (
                        <IonItem>
                            <IonLabel position="floating">Zona</IonLabel>
                            <IonSelect
                                cancelText="Torna Indietro"
                                mode="ios"
                                interface="action-sheet"
                                value={inputZonaValue}
                                onIonChange={inputZonaChangedHandler}
                            >
                                {possibleZona
                                    .filter(
                                        (e) => e.comune === inputComuneValue
                                    )
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
                    <FormInput
                        title={"Indirizzo"}
                        inputValue={inputIndirizzoValue}
                        type={"text"}
                        inputIsInvalid={inputIndirizzoIsInvalid}
                        inputChangeHandler={inputIndirizzoChangedHandler}
                        inputTouchHandler={inputIndirizzoTouchedHandler}
                        errorMessage={"Lunghezza non valida"}
                        reset={inputIndirizzoReset}
                    />
                    <FormInput
                        title={"Prezzo richiesto"}
                        inputValue={inputPrezzoValue}
                        type={"number"}
                        inputIsInvalid={inputPrezzoIsInvalid}
                        inputChangeHandler={inputPrezzoChangedHandler}
                        inputTouchHandler={inputPrezzoTouchedHandler}
                        errorMessage={"Il prezzo deve essere maggiore di 0 €"}
                        reset={inputPrezzoReset}
                    />
                    <FormSelect
                        title="Riscaldamento"
                        value={inputRiscaldamentoValue}
                        function={inputRiscaldamentoChangedHandler}
                        possibleValues={possibleRiscaldamenti}
                    />
                    <FormSelect
                        title="Classe Energetica"
                        value={inputClasseEnergeticaValue}
                        function={inputClasseEnergeticaChangedHandler}
                        possibleValues={possibleEnergeticClasses}
                    />
                    {inputClasseEnergeticaValue !== "esente" && (
                        <FormInput
                            title={"Consumo espresso in KWh/m³a"}
                            inputValue={inputConsumoValue}
                            type={"text"}
                            inputIsInvalid={inputConsumoIsInvalid}
                            inputChangeHandler={inputConsumoChangedHandler}
                            inputTouchHandler={inputConsumoTouchedHandler}
                            errorMessage={
                                "Il consumo deve essere maggiore di 0 KWh/m³a"
                            }
                            reset={inputConsumoReset}
                        />
                    )}
                    <FormSelect
                        title="Contratto"
                        value={inputContrattoValue}
                        function={inputContrattoChangedHandler}
                        possibleValues={possibleContratti}
                    />
                    <FormSelect
                        title="Categoria"
                        value={inputCategoriaValue}
                        function={inputCategoriaChangedHandler}
                        possibleValues={possibleCategories}
                    />
                    <FormSelect
                        title="Stato"
                        value={inputStatoValue}
                        function={inputStatoChangedHandler}
                        possibleValues={possibleStato}
                    />
                    <FormSelect
                        title="Libero"
                        value={inputLiberoValue}
                        function={inputLiberoChangedHandler}
                        possibleValues={possibleLibero}
                    />
                    <FormSelect
                        title="Status"
                        value={inputStatusValue}
                        function={inputStatusChangedHandler}
                        possibleValues={possibleStatus.map((el) =>
                            el.toLowerCase()
                        )}
                    />
                    <FormSelect
                        title="Piano"
                        value={inputPianoValue}
                        function={inputPianoChangedHandler}
                        possibleValues={possiblePiano}
                    />
                    <FormInput
                        title="Totale piani edificio"
                        inputValue={inputTotalePianiValue}
                        type={"text"}
                        inputIsInvalid={inputTotalePianiIsInvalid}
                        inputChangeHandler={inputTotalePianiChangedHandler}
                        inputTouchHandler={inputTotalePianiTouchedHandler}
                        errorMessage={"Valore non valido"}
                        reset={inputTotalePianiReset}
                    />
                    <TextArea
                        title={`Descrizione ${getErrorDescrizione()}`}
                        inputValue={inputDescrizioneValue}
                        inputChangeHandler={inputDescrizioneChangedHandler}
                        inputTouchHandler={inputDescrizioneTouchedHandler}
                        reset={inputDescrizioneReset}
                    />
                </FormGroup>
                <FormGroup title="Caratteristiche - Opzionali">
                    <FormInputBoolean
                        condition={inputAscensoreValue}
                        setCondition={setInputAscensoreValue}
                        sentence="E' presente l'ascensore"
                    />
                    <FormInputBoolean
                        condition={inputPortaBlindataValue}
                        setCondition={setInputPortaBlindataValue}
                        sentence="La porta d'ingresso è blindata"
                    />
                    <FormInputBoolean
                        condition={isSpeseCondominiali}
                        setCondition={setIsSpeseCondominiali}
                        sentence="Sono presenti spese condominiali"
                    />
                    {isSpeseCondominiali && (
                        <FormInput
                            title="Spese condominiali (€ al mese)"
                            inputValue={inputSpeseCondominialiValue}
                            type={"number"}
                            inputIsInvalid={inputSpeseCondominialiIsInvalid}
                            inputChangeHandler={
                                inputSpeseCondominialiChangedHandler
                            }
                            inputTouchHandler={
                                inputSpeseCondominialiTouchedHandler
                            }
                            errorMessage={
                                "Le spese condominiali non possono essere più basse di 0 €/mese"
                            }
                            reset={inputSpeseCondominialiReset}
                        />
                    )}
                    <FormInputBoolean
                        condition={isSpeseExtra}
                        setCondition={setIsSpeseExtra}
                        sentence="Sono in previsione spese extra"
                    />
                    {isSpeseExtra && (
                        <FormInput
                            title="Note su Spese-Extra"
                            inputValue={inputSpeseExtraValue}
                            type={"text"}
                            inputIsInvalid={inputSpeseExtraIsInvalid}
                            inputChangeHandler={inputSpeseExtraChangedHandler}
                            inputTouchHandler={inputSpeseExtraTouchedHandler}
                            errorMessage={""}
                            reset={inputSpeseExtraReset}
                        />
                    )}
                    <FormInputBoolean
                        condition={isTaverna}
                        setCondition={setIsTaverna}
                        sentence="E' presente la taverna"
                    />
                    {isTaverna && (
                        <FormInput
                            title="Descrizione Taverna"
                            inputValue={inputTavernaValue}
                            type={"text"}
                            inputIsInvalid={inputTavernaIsInvalid}
                            inputChangeHandler={inputTavernaChangedHandler}
                            inputTouchHandler={inputTavernaTouchedHandler}
                            errorMessage={""}
                            reset={inputTavernaReset}
                        />
                    )}
                    <FormInputBoolean
                        condition={isMansarda}
                        setCondition={setIsMansarda}
                        sentence="E' presente la mansarda"
                    />
                    {isMansarda && (
                        <FormInput
                            title="Descrizione Mansarda"
                            inputValue={inputMansardaValue}
                            type={"text"}
                            inputIsInvalid={inputMansardaIsInvalid}
                            inputChangeHandler={inputMansardaChangedHandler}
                            inputTouchHandler={inputMansardaTouchedHandler}
                            errorMessage={""}
                            reset={inputMansardaReset}
                        />
                    )}
                    <FormInputBoolean
                        condition={isCantina}
                        setCondition={setIsCantina}
                        sentence="E' presente la cantina"
                    />
                    {isCantina && (
                        <FormInput
                            title="Descrizione Cantina"
                            inputValue={inputCantinaValue}
                            type={"text"}
                            inputIsInvalid={inputCantinaIsInvalid}
                            inputChangeHandler={inputCantinaChangedHandler}
                            inputTouchHandler={inputCantinaTouchedHandler}
                            errorMessage={""}
                            reset={inputCantinaReset}
                        />
                    )}
                    {inputRiscaldamentoValue === "autonomo" && (
                        <FormInput
                            title="Spese riscaldamento (€ al mese)"
                            inputValue={inputSpeseRiscaldamentoValue}
                            type={"number"}
                            inputIsInvalid={inputSpeseRiscaldamentoIsInvalid}
                            inputChangeHandler={
                                inputSpeseRiscaldamentoChangedHandler
                            }
                            inputTouchHandler={
                                inputSpeseRiscaldamentoTouchedHandler
                            }
                            errorMessage={
                                "Le spese di riscaldamento non possono essere più basse di 0 €/mese"
                            }
                            reset={inputSpeseRiscaldamentoReset}
                        />
                    )}
                    <FormInputBoolean
                        condition={isAntifurto}
                        setCondition={setIsAntifurto}
                        sentence="E' presente l'antifurto"
                    />
                    {isAntifurto && (
                        <FormInput
                            title="Antifurto"
                            inputValue={inputAntifurtoValue}
                            type={"text"}
                            inputIsInvalid={inputAntifurtoIsInvalid}
                            inputChangeHandler={inputAntifurtoChangedHandler}
                            inputTouchHandler={inputAntifurtoTouchedHandler}
                            errorMessage={""}
                            reset={inputAntifurtoReset}
                        />
                    )}
                    <FormSelect
                        title="Esposizione"
                        value={inputEsposizioneValue}
                        function={inputEsposizioneChangedHandler}
                        possibleValues={possibiliEsposizioni}
                    />
                    <FormSelect
                        title="Arredamento"
                        value={inputArredamentoValue}
                        function={inputArredamentoChangedHandler}
                        possibleValues={possibiliArredamenti}
                    />
                    <FormSelect
                        title="Balconi"
                        value={inputBalconiValue}
                        function={inputBalconiChangedHandler}
                        possibleValues={possibiliBalconiTerrazzi}
                    />
                    <FormSelect
                        title="Terrazzi"
                        value={inputTerrazziValue}
                        function={inputTerrazziChangedHandler}
                        possibleValues={possibiliBalconiTerrazzi}
                    />
                    <FormSelect
                        title="Box"
                        value={inputBoxValue}
                        function={inputBoxChangedHandler}
                        possibleValues={possibiliBox}
                    />
                    <FormSelect
                        title="Giardino"
                        value={inputGiardinoValue}
                        function={inputGiardinoChangedHandler}
                        possibleValues={possibiliGiardini}
                    />
                    <FormSelect
                        title="Aria Condizionata"
                        value={inputAriaCondizionataValue}
                        function={inputAriaCondizionataChangedHandler}
                        possibleValues={possibiliAC}
                    />
                    <FormSelect
                        title="Proprietà"
                        value={inputProprietaValue}
                        function={inputProprietaChangedHandler}
                        possibleValues={possibiliProprieta}
                    />
                    <FormInput
                        title="Anno di Costruzione"
                        inputValue={inputAnnoCostruzioneValue}
                        type={"number"}
                        inputIsInvalid={inputAnnoCostruzioneIsInvalid}
                        inputChangeHandler={inputAnnoCostruzioneChangedHandler}
                        inputTouchHandler={inputAnnoCostruzioneTouchedHandler}
                        errorMessage={`L'anno di costruzione deve essere compreso tra il 1800 ed il ${new Date().getFullYear()}`}
                        reset={inputAnnoCostruzioneReset}
                    />
                    <FormSelect
                        title="Categoria Catastale"
                        value={inputCategoriaCatastaleValue}
                        function={inputCategoriaCatastaleChangedHandler}
                        possibleValues={possibiliCategorieCatastali}
                    />
                    <FormInput
                        title="Rendita Catastale (€/anno)"
                        inputValue={inputRenditaValue}
                        type={"number"}
                        inputIsInvalid={inputRenditaIsInvalid}
                        inputChangeHandler={inputRenditaChangedHandler}
                        inputTouchHandler={inputRenditaTouchedHandler}
                        errorMessage={`La rendita catastale non può essere più bassa di 0 €/anno`}
                        reset={inputRenditaReset}
                    />
                    <FormSelect
                        title="Impianto Elettrico"
                        value={inputImpiantoElettricoValue}
                        function={inputImpiantoElettricoChangedHandler}
                        possibleValues={possibiliImpianti}
                    />
                    <FormSelect
                        title="Impianto Idraulico"
                        value={inputImpiantoIdraulicoValue}
                        function={inputImpiantoIdraulicoChangedHandler}
                        possibleValues={possibiliImpianti}
                    />
                    <FormSelect
                        title="Combustibile"
                        value={inputCombustibileValue}
                        function={inputCombustibileChangedHandler}
                        possibleValues={possibleCombustibili}
                    />
                    <FormSelect
                        title="Livelli"
                        value={inputLivelliValue}
                        function={inputLivelliChangedHandler}
                        possibleValues={possibleLivelli}
                    />
                    <FormSelect
                        title="Serramenti Interni"
                        value={inputSerramentiInterniValue}
                        function={inputSerramentiInterniChangedHandler}
                        possibleValues={possibleSerramentiInterni}
                    />
                    <FormSelect
                        title="Serramenti Esterni"
                        value={inputSerramentiEsterniValue}
                        function={inputSerramentiEsterniChangedHandler}
                        possibleValues={possibleSerramentiEsterni}
                    />
                    <FormSelect
                        title="Citofono"
                        value={inputCitofonoValue}
                        function={inputCitofonoChangedHandler}
                        possibleValues={possibleCitofoni}
                    />
                    <FormSelect
                        title="Portineria"
                        value={inputPortineriaValue}
                        function={inputPortineriaChangedHandler}
                        possibleValues={possiblePortineria}
                    />
                    <FormInput
                        title="Cablato"
                        inputValue={inputCablatoValue}
                        type={"text"}
                        inputIsInvalid={inputCablatoIsInvalid}
                        inputChangeHandler={inputCablatoChangedHandler}
                        inputTouchHandler={inputCablatoTouchedHandler}
                        errorMessage={``}
                        reset={inputCablatoReset}
                    />
                    <FormInput
                        title="Altezza Soffitto"
                        inputValue={inputAltezzaValue}
                        type={"text"}
                        inputIsInvalid={inputAltezzaIsInvalid}
                        inputChangeHandler={inputAltezzaChangedHandler}
                        inputTouchHandler={inputAltezzaTouchedHandler}
                        errorMessage={`L'altezza dichiarata deve essere di almeno 1 metro`}
                        reset={inputAltezzaReset}
                    />
                    {inputContrattoValue === "affitto" && (
                        <>
                            <FormSelect
                                title="Tipo Contratto"
                                value={inputTipoContrattoValue}
                                function={inputTipoContrattoChangedHandler}
                                possibleValues={possibiliTipiContratti}
                            />
                            <FormSelect
                                title="Cauzione"
                                value={inputCauzioneValue}
                                function={inputCauzioneChangedHandler}
                                possibleValues={possibiliCauzioni}
                            />
                        </>
                    )}
                </FormGroup>
                <ItemSelector
                    titoloGruppo={`Proprietario ${
                        proprietarioValue ? "presente" : "mancante"
                    }`}
                    titoloBottone="Aggiungi Proprietario dalla Lista"
                    isItemPresent={!!proprietarioValue}
                    getItem={() => getPersone("proprietario")}
                    openSelector={() => {
                        openModal("proprietario");
                        setNewProprietarioPartOpened(false);
                    }}
                >
                    {!proprietarioValue && !newProprietarioPartOpened && (
                        <IonButton
                            expand="block"
                            color="light"
                            onClick={() => setNewProprietarioPartOpened(true)}
                        >
                            {"Inserisci Nuova Persona"}
                        </IonButton>
                    )}
                    {newProprietarioPartOpened && (
                        <>
                            <FormInput
                                title={"Nome (Obbligatorio - almeno 5 lettere)"}
                                inputValue={inputNameValue}
                                type={"text"}
                                inputIsInvalid={inputNameIsInvalid}
                                inputChangeHandler={inputNameChangedHandler}
                                inputTouchHandler={inputNameTouchedHandler}
                                errorMessage={"Nome troppo corto"}
                                reset={inputNameReset}
                            />
                            <FormInput
                                title={"Telefono"}
                                inputValue={inputPhoneValue}
                                type={"text"}
                                inputIsInvalid={inputPhoneIsInvalid}
                                inputChangeHandler={inputPhoneChangedHandler}
                                inputTouchHandler={inputPhoneTouchedHandler}
                                errorMessage={"Telefono non valido"}
                                reset={inputPhoneReset}
                            />
                            <FormInput
                                title={"Email"}
                                inputValue={inputEmailValue}
                                type={"email"}
                                inputIsInvalid={inputEmailIsInvalid}
                                inputChangeHandler={inputEmailChangedHandler}
                                inputTouchHandler={inputEmailTouchedHandler}
                                errorMessage={"Email non valida"}
                                reset={inputEmailReset}
                            />
                        </>
                    )}
                </ItemSelector>
                <ItemSelector
                    titoloGruppo={`Inquilini `}
                    titoloBottone="Aggiungi Inquilino"
                    isItemPresent={!!inquiliniValue}
                    getItem={() => getPersone("inquilino")}
                    openSelector={() => openModal("inquilino")}
                    multiple
                />
                <IonButton
                    expand="block"
                    disabled={isFormInvalid}
                    onClick={(e) => submitForm(e)}
                >
                    {getSubmitText()}
                </IonButton>
            </IonList>
            <Modal
                setIsOpen={setModalIsOpen}
                isOpen={modalIsOpen}
                title={`Scegli persona come ${choiceMode}`}
                handler={() => setModalIsOpen(false)}
            >
                <Selector
                    entitiesType="persone"
                    setCurrentEntity={setCurrentPersona}
                    selectMode
                    localQuery
                />
            </Modal>
        </form>
    );
};

export default ImmobileForm;
