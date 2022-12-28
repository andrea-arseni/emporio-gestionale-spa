import styles from "./HouseCard.module.css";
import notAvailable from "../../../assets/notAvailable.png";
import { ReactComponent as SquareMetersIcon } from "../../../assets/icons/planimetry.svg";
import { ReactComponent as TownIcon } from "../../../assets/icons/building.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Immobile } from "../../../entities/immobile.model";
import axiosInstance from "../../../utils/axiosInstance";
import { IonSpinner } from "@ionic/react";
import { addImage } from "../../../store/public-immobile-slice";
import { Documento } from "../../../entities/documento.model";
import {
    capitalize,
    correctZona,
    stringifyNumber,
} from "../../../utils/stringUtils";
import useWindowSize from "../../../hooks/use-size";

const HouseCard: React.FC<{
    house: Immobile;
}> = (props) => {
    const houseFile = useSelector((state: RootState) => {
        const house = state.publicImmobile.houses.find(
            (el) => el.id === props.house.id
        );
        return house &&
            house.files &&
            house.files[0] &&
            house.files[0].base64String
            ? house.files[0].base64String
            : null;
    });

    const [width] = useWindowSize();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const navigateToDedicatedHousePage = () =>
        navigate("/i-nostri-immobili/" + props.house.id);

    const [isLoading, setIsLoading] = useState(!!!houseFile);

    const [imageString, setImageString] = useState(
        houseFile ? houseFile : notAvailable
    );

    useEffect(() => {
        const fetchImage = async (firstPhoto: Documento) => {
            try {
                const res = await axiosInstance.get(
                    `immobili/${props.house.id}/files/${firstPhoto.id}`
                );
                const immagine = "data:image/png;base64," + res.data.byteArray;
                setImageString(immagine);
                dispatch(
                    addImage({
                        id: firstPhoto.id!,
                        file: { ...firstPhoto, base64String: immagine },
                    })
                );
                setIsLoading(false);
            } catch (e: any) {
                setIsLoading(false);
            }
        };

        const photos = props.house.files!.filter(
            (el) => el.tipologia === "FOTO"
        );

        let firstPhoto = null;

        if (photos) {
            photos.sort((el1, el2) => +el1.nome! - +el2.nome!);
            firstPhoto = photos[0];
        }

        if (!firstPhoto || houseFile) {
            setIsLoading(false);
        } else {
            fetchImage(firstPhoto);
        }
    }, [props.house.id, props.house.files, dispatch, houseFile]);

    const addLocali = () => {
        const tipologia = props.house.tipologia?.toLowerCase();
        return !tipologia ||
            tipologia === "box" ||
            tipologia === "camera singola" ||
            tipologia === "loft" ||
            tipologia === "posto auto" ||
            tipologia === "posto letto in camera condivisa" ||
            tipologia === "uffici open space"
            ? ""
            : `di ${props.house.locali} local${
                  props.house.locali === "1" ? "e" : "i"
              }`;
    };

    return (
        <div
            onClick={navigateToDedicatedHousePage}
            className={`${styles.houseCard}`}
        >
            {width <= 450 && (
                <p className={styles.titolo}>
                    <span className={styles.ref}>{props.house.ref}</span>
                    {props.house.titolo}
                </p>
            )}
            <div className={`${styles.wrapper} centered`}>
                <div className={`centered ${styles.imgWrapper}`}>
                    {isLoading && (
                        <div
                            className={`fullHeight centered ${styles.spinnerWrapper}`}
                        >
                            <IonSpinner />
                        </div>
                    )}
                    {!isLoading && (
                        <img alt="Foto non disponibile" src={imageString} />
                    )}
                </div>
                <div className={styles.textPart}>
                    {width > 450 && (
                        <p className={styles.titolo}>
                            <span className={styles.ref}>
                                {props.house.ref}
                            </span>
                            {props.house.titolo}
                        </p>
                    )}
                    <span>
                        <i className="bi bi-currency-euro rightSpace"></i>
                        {`${capitalize(
                            props.house.contratto!
                        )} a ${stringifyNumber(props.house.prezzo!)} €
                    ${props.house.contratto === "affitto" ? " al mese" : ""}`}
                    </span>
                    <span>
                        <i className="bi bi-house-door rightSpace"></i>
                        {`${
                            props.house.tipologia
                                ? capitalize(props.house.tipologia)
                                : ""
                        } ${addLocali()}`}
                    </span>
                    <span>
                        <SquareMetersIcon className={styles.icon} />{" "}
                        {`${props.house.superficie} m²
                    ${width > 500 ? "di superficie" : ""}`}
                    </span>
                    <span>
                        <TownIcon className={styles.icon} />
                        {props.house.comune}{" "}
                        {props.house.zona && width > 500
                            ? `(${correctZona(props.house.zona)})`
                            : ""}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HouseCard;
