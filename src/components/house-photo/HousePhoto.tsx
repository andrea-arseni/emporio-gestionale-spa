import styles from "./HousePhoto.module.css";
import { ReactComponent as ArrowIcon } from "../../assets/icons/left-arrow.svg";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Immobile } from "../../entities/immobile.model";
import axiosInstance from "../../utils/axiosInstance";
import { addImage } from "../../store/public-immobile-slice";
import { IonSpinner } from "@ionic/react";

const HousePhoto: React.FC<{
    currentIndex: number;
    onChangeIndex: Dispatch<SetStateAction<number>>;
}> = (props) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const id = Number.parseInt(
        location.pathname.split("?")[0].split("/").pop()!
    );

    const house: Immobile | undefined = useAppSelector((state) =>
        state.publicImmobile.houses.find((el) => el.id === id)
    );

    useEffect(() => {
        const fetchImage = async () => {
            const fileId = house!.files![props.currentIndex].id;
            const image = await axiosInstance.get(
                "immobili/" + house!.id + "/files/" + fileId
            );
            dispatch(
                addImage({
                    id: house!.id!,
                    file: {
                        ...house!.files![props.currentIndex],
                        base64String:
                            "data:image/png;base64," + image.data.byteArray,
                    },
                })
            );
        };

        if (
            house &&
            house.files &&
            house.files.length > 0 &&
            !house.files[props.currentIndex].base64String
        ) {
            fetchImage();
        }
    }, [dispatch, house, props.currentIndex]);

    const isFirstIndex = () => props.currentIndex === 0;

    const isLastIndex = () =>
        house && props.currentIndex === house.files!.length - 1;

    if (
        !house ||
        (house &&
            house.files!.length > 0 &&
            !house.files![props.currentIndex].base64String)
    ) {
        return (
            <div className={styles.frame}>
                <div
                    className={`${
                        window.innerWidth > 510
                            ? styles.wrapper
                            : styles.littleWrapper
                    } ${styles.spinnerWrapper}`}
                >
                    <IonSpinner />
                </div>
            </div>
        );
    }

    if (house && house.files!.length === 0) {
        return null;
    }

    return (
        <div className={styles.frame}>
            <div className={`${styles.imageWrapper} ${styles.wrapper}`}>
                {isFirstIndex() && <div></div>}
                {!isFirstIndex() && (
                    <div
                        className={`${styles.arrow} centered`}
                        onClick={() => {
                            props.onChangeIndex((prevIndex) => --prevIndex);
                        }}
                    >
                        <ArrowIcon />
                    </div>
                )}
                <img
                    src={house.files![props.currentIndex].base64String}
                    alt="Immagine non disponibile"
                />
                {isLastIndex() && <div></div>}
                {!isLastIndex() && (
                    <div
                        className={`${styles.arrow} ${styles.right} centered`}
                        onClick={() => {
                            props.onChangeIndex((prevIndex) => ++prevIndex);
                        }}
                    >
                        <ArrowIcon />
                    </div>
                )}
                <div className={styles.numerazione}>
                    {props.currentIndex + 1} di {house.files!.length}
                </div>
            </div>
        </div>
    );
};

export default HousePhoto;
