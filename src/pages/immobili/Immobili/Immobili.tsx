import { IonButton, IonLoading, useIonAlert } from "@ionic/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { URLSearchParams } from "url";
import HouseCards from "../../../components/house-cards/HouseCards";
import NoHouses from "../../../components/no-houses/NoHouses";
import { Immobile } from "../../../entities/immobile.model";
import axiosInstance from "../../../utils/axiosInstance";
import styles from "./Immobili.module.css";
import PageFooter from "../../../components/page-footer/PageFooter";
import { addHouses } from "../../../store/public-immobile-slice";
import { useAppDispatch } from "../../../hooks";

const buildQueryParam = (
    searchParams: URLSearchParams,
    object: string,
    queryParams: string
) => {
    return searchParams.get(object) ||
        object === "contratto" ||
        object === "categoria"
        ? `${queryParams === "" ? "?" : queryParams + "&"}${object}=${
              searchParams.get(object) ? searchParams.get(object) : "Tutti"
          }`
        : queryParams;
};

const buildQueryParams = (searchParams: URLSearchParams) => {
    let keys = ["contratto", "categoria", "priceMin", "priceMax", "page"];
    let queryParams = "";
    keys.forEach(
        (el) => (queryParams = buildQueryParam(searchParams, el, queryParams))
    );
    return queryParams;
};

const Immobili: React.FC = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [houses, setHouses] = useState<Immobile[]>([]);

    const [searchParams] = useSearchParams();

    const [page, setPage] = useState<number>(
        searchParams.get("page") ? +searchParams.get("page")! : 1
    );

    const [isLoading, setIsLoading] = useState(false);

    const [numberOfResults, setNumberOfResults] = useState(0);

    const [presentAlert] = useIonAlert();

    useEffect(() => {
        const fetchImmobili = async () => {
            searchParams.set("page", page.toString());
            const queryParams = buildQueryParams(searchParams);
            try {
                setIsLoading(true);
                const res = await axiosInstance.get(
                    "immobili" + queryParams + "&sort=prezzo-desc"
                );
                setNumberOfResults(res.data.numberOfResults);
                dispatch(addHouses(res.data.data));
                setHouses(res.data.data);
                setIsLoading(false);
            } catch (e: any) {
                setIsLoading(false);
                presentAlert({
                    header: "Errore",
                    message: e.response
                        ? e.response.data.message
                        : "Errore sconosciuto, operazione fallita",
                    buttons: [
                        {
                            text: "Chiudi",
                            handler: () => navigate(-1),
                        },
                    ],
                });
            }
        };
        fetchImmobili();
    }, [searchParams, dispatch, navigate, presentAlert, page]);

    const goToFilterPage = () => navigate("/filtra" + location.search);

    return (
        <div className={`text-center fullHeight ${styles.immobili}`}>
            <div className={`row ${styles.row}`}>
                <IonButton
                    className={styles.filterButton}
                    expand="full"
                    mode="md"
                    type="button"
                    onClick={() => goToFilterPage()}
                >
                    Filtra gli Immobili
                </IonButton>

                <IonLoading cssClass="loader" isOpen={isLoading} />
                {!isLoading && houses.length === 0 && <NoHouses />}
                {houses.length > 0 && <HouseCards listOfHouses={houses} />}
                {houses.length > 0 && (
                    <PageFooter
                        numberOfResults={numberOfResults}
                        page={page}
                        setPage={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default Immobili;
