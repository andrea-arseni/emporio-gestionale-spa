import React, { useEffect, useState } from "react";
import styles from "./FilterForm.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { capitalize, stringifyNumber } from "../../../utils/stringUtils";
import { IonButton, useIonAlert } from "@ionic/react";

const generatePriceList = (isContrattoAffitto: boolean) => {
    const priceList: { value: number; name: string }[] = [];
    for (let i = 100; i < 10000; i += 100) {
        const number = isContrattoAffitto ? i : i * 100;
        priceList.push({
            value: number,
            name: stringifyNumber(number) + " €",
        });
    }
    priceList.unshift({ value: 0, name: "Indifferente" });
    priceList.push({
        value: 10000000,
        name: isContrattoAffitto ? "10.000 € e oltre" : "Un milione e oltre",
    });
    return priceList;
};

const PRICES_VENDITA = generatePriceList(false);

const PRICES_AFFITTO = generatePriceList(true);

const FilterForm: React.FC<{}> = () => {
    const navigate = useNavigate();

    const [priceList, setPriceList] = useState<
        { value: number; name: string }[]
    >([]);

    const [minPriceIndex, setMinPriceIndex] = useState(0);

    const [maxPriceIndex, setMaxPriceIndex] = useState(100);

    const [presentAlert] = useIonAlert();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const isContrattoAffitto =
            searchParams.get("contratto")?.trim().toLowerCase() === "affitto";

        setPriceList(isContrattoAffitto ? PRICES_AFFITTO : PRICES_VENDITA);

        const PRICES = isContrattoAffitto ? PRICES_AFFITTO : PRICES_VENDITA;

        const retrieveInitialIndex = (
            searchParamName: string,
            defaultValue: number
        ) => {
            if (!searchParams.get(searchParamName) || PRICES.length === 0) {
                return defaultValue;
            }
            const index = PRICES.findIndex(
                (el) =>
                    el.value.toString() === searchParams.get(searchParamName)
            );
            if (index === -1) {
                presentAlert({
                    header: "Attenzione!",
                    message: `Parametro di ricerca ${
                        searchParamName === "priceMin"
                            ? `"priceMin"`
                            : `"priceMax"`
                    } non corretto. Usare il form per evitare errori.`,
                    buttons: [
                        {
                            text: "Chiudi",
                            handler: () => {
                                setSearchParams({
                                    contratto: "Tutti",
                                    categoria: "Tutti",
                                    priceMin: "0",
                                    priceMax: "10000000",
                                });
                            },
                        },
                    ],
                });
                return defaultValue;
            }
            return index;
        };

        setMinPriceIndex(retrieveInitialIndex("priceMin", 0));

        setMaxPriceIndex(retrieveInitialIndex("priceMax", 100));
    }, [searchParams, presentAlert, setSearchParams]);

    const [contratto, setContratto] = useState<string>(
        searchParams.get("contratto") ? searchParams.get("contratto")! : "Tutti"
    );

    const [categoria, setCategoria] = useState<string>(
        searchParams.get("categoria") ? searchParams.get("categoria")! : "Tutti"
    );

    useEffect(() => {
        const isContrattoAffitto =
            contratto?.trim().toLowerCase() === "affitto";

        setPriceList(isContrattoAffitto ? PRICES_AFFITTO : PRICES_VENDITA);
    }, [contratto]);

    const formControlHandler = (
        event: any,
        type: "contratto" | "categoria"
    ) => {
        selectFormHandler();
        type === "contratto"
            ? setContratto(event.target.value)
            : setCategoria(event.target.value);
    };

    const [isFormUsed, setIsFormUsed] = useState(false);

    const minPriceHandler = (event: any) => {
        selectFormHandler();
        const newMinValue = event.target.value;
        const newMinValueIndex = priceList.findIndex(
            (el) => el.value.toString() === newMinValue
        );
        setMinPriceIndex(newMinValueIndex);
    };

    const maxPriceHandler = (event: any) => {
        selectFormHandler();
        const newMaxValue = event.target.value;
        const newMaxValueIndex = priceList.findIndex(
            (el) => el.value.toString() === newMaxValue
        );
        setMaxPriceIndex(newMaxValueIndex);
    };
    const selectFormHandler = () => setIsFormUsed(true);

    // setNewQueryParams
    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate(
            `/i-nostri-immobili?contratto=${contratto}&categoria=${categoria}&priceMin=${priceList[minPriceIndex].value}&priceMax=${priceList[maxPriceIndex].value}`
        );
    };

    return (
        <div className={`centered ${styles.formWrapper}`}>
            <form className={`${styles.form} centered`}>
                <h4 className={styles.titolo}>Filtra gli Immobili</h4>
                <label htmlFor="contratto">Contratto</label>
                <select
                    className={styles.select}
                    name="contratto"
                    value={contratto}
                    onChange={(e) => formControlHandler(e, "contratto")}
                >
                    {["Tutti", "Vendita", "Affitto"].map((el) => (
                        <option key={el} value={el.toString().toLowerCase()}>
                            {typeof el === "string"
                                ? capitalize(el.toLowerCase().replace("_", " "))
                                : el}
                        </option>
                    ))}
                </select>
                <label htmlFor="categoria">Categoria</label>
                <select
                    className={styles.select}
                    name="categoria"
                    value={categoria}
                    onChange={(e) => formControlHandler(e, "categoria")}
                >
                    {["Tutti", "Residenziale", "Commerciale"].map((el) => (
                        <option key={el} value={el.toString().toLowerCase()}>
                            {typeof el === "string"
                                ? capitalize(el.toLowerCase().replace("_", " "))
                                : el}
                        </option>
                    ))}
                </select>
                {priceList.length > 0 && (
                    <>
                        <label htmlFor="minPrice">Prezzo Minimo</label>
                        <select
                            className={styles.select}
                            name="minPrice"
                            value={priceList[minPriceIndex].value}
                            onChange={minPriceHandler}
                        >
                            {priceList
                                .filter((_, index) => index < maxPriceIndex)
                                .map((el) => (
                                    <option key={el.value} value={el.value}>
                                        {el.name}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
                {priceList.length > 0 && (
                    <>
                        <label htmlFor="maxPrice">Prezzo massimo</label>
                        <select
                            className={styles.select}
                            name="maxPrice"
                            value={priceList[maxPriceIndex].value}
                            onChange={maxPriceHandler}
                        >
                            {priceList
                                .filter((_, index) => index > minPriceIndex)
                                .map((el) => (
                                    <option key={el.value} value={el.value}>
                                        {el.name}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
                <br />
                <IonButton disabled={!isFormUsed} onClick={submitForm}>
                    Applica Filtro
                </IonButton>
                <span style={{ height: "6px" }} />
                <IonButton
                    fill="outline"
                    role={"button"}
                    onClick={() => navigate(-1)}
                >
                    Indietro
                </IonButton>
            </form>
        </div>
    );
};

export default FilterForm;
