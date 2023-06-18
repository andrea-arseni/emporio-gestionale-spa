import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonSpinner,
    useIonAlert,
} from "@ionic/react";
import {
    arrowRedoOutline,
    arrowUndoOutline,
    checkmarkSharp,
} from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import notAvailable from "../../../assets/notAvailable.png";
import {
    deselectPhoto,
    erasePhoto,
    resetMovingPhotos,
    selectPhoto,
    setIsSelectionModeAllowed,
    startMovingPhoto,
} from "../../../store/immobile-slice";
import {
    fetchFileById,
    swapPhotoPositions,
} from "../../../store/immobile-thunk";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import styles from "./ImmobiliPhoto.module.css";
import useErrorHandler from "../../../hooks/use-error-handler";

const ImmobiliPhoto: React.FC<{
    id: number;
}> = (props) => {
    const { errorHandler } = useErrorHandler();

    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const isSelectionModeActivated = useAppSelector(
        (state) => state.immobile.isSelectionModeActivated
    );

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const foto = immobile?.files?.find((el) => el.id === props.id)!;

    const fotoInMovimento = useAppSelector(
        (state) => state.immobile.startingPhotoId
    );

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [rotatingSense, setRotatingSense] = useState<null | "90" | "-90">(
        null
    );

    const [isRotating, setIsRotating] = useState<boolean>(false);

    const isSelected = useAppSelector((state) =>
        state.immobile.listIdPhotoSelected.find((id) => props.id === id)
    );

    useEffect(() => {
        setShowLoading(foto.base64String === "fetching");
    }, [foto.base64String]);

    useEffect(() => {
        let mounted = true;
        let timeOut: NodeJS.Timeout | null = null;

        const rotatePhoto = async () => {
            setIsRotating(true);
            dispatch(setIsSelectionModeAllowed(false));
            setShowLoading(true);
            try {
                const reqBody = { rotating: +rotatingSense! };
                const url = `/immobili/${immobile?.id}/files/${props.id}`;
                await axiosSecondaryApi.patch(url, reqBody);
                if (!mounted) return;
                setRotatingSense(null);
                dispatch(erasePhoto({ id: props.id! }));
                timeOut = setTimeout(() => {
                    setShowLoading(false);
                    setIsRotating(false);
                    dispatch(
                        fetchFileById(
                            `/immobili/${immobile?.id}/files/${props.id}`
                        )
                    );
                    dispatch(setIsSelectionModeAllowed(true));
                }, 4000);
            } catch (e) {
                if (!mounted) return;
                setRotatingSense(null);
                setIsRotating(false);
                setShowLoading(false);
                dispatch(setIsSelectionModeAllowed(true));
                errorHandler(e, "Rotazione non riuscita");
            }
        };

        if (rotatingSense) rotatePhoto();

        return () => {
            mounted = false;
            if (timeOut) clearTimeout(timeOut);
        };
    }, [
        rotatingSense,
        isRotating,
        props.id,
        dispatch,
        errorHandler,
        immobile?.id,
    ]);

    const [startingTouchTime, setStartingTouchTime] = useState<number>(0);
    const [endingTouchTime, setEndingTouchTime] = useState<number>(0);

    const rifiutaSpostamento = useCallback(() => {
        presentAlert({
            header: "Scambio non permesso",
            message: `Non è possibile spostare una foto con la scritta.`,
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
            ],
        });
    }, [presentAlert]);

    useEffect(() => {
        const howManyMilliSeconds = endingTouchTime - startingTouchTime;
        const itHasBeenASecond = howManyMilliSeconds > 800;
        if (itHasBeenASecond) {
            setStartingTouchTime(0);
            setEndingTouchTime(0);

            if (foto.nome === "0") {
                rifiutaSpostamento();
                return;
            }

            if (!fotoInMovimento) {
                dispatch(startMovingPhoto(foto.id!));
            } else {
                dispatch(
                    swapPhotoPositions({
                        url: `/immobili/${immobile?.id}/files/${fotoInMovimento}`,
                        firstName: foto!.nome!,
                        secondName: immobile?.files?.find(
                            (el) => el.id === fotoInMovimento
                        )?.nome!,
                    })
                );
            }
        }
    }, [
        startingTouchTime,
        endingTouchTime,
        foto,
        immobile,
        fotoInMovimento,
        dispatch,
        rifiutaSpostamento,
    ]);

    const inizializzaMovimento = () => setStartingTouchTime(Date.now());

    const resetMovimento = () => setEndingTouchTime(Date.now());

    const gestisciFotoInSostituzione = () => {
        if (foto.nome === "0") {
            rifiutaSpostamento();
            return;
        }
        dispatch(startMovingPhoto(foto.id!));
    };

    const sostituisciFoto = () => {
        if (
            foto.id === fotoInMovimento ||
            fotoInMovimento === 0 ||
            foto.id === 0
        ) {
            dispatch(resetMovingPhotos());
            return;
        }
        if (foto.nome === "0") {
            rifiutaSpostamento();
            return;
        }
        dispatch(
            swapPhotoPositions({
                url: `/immobili/${immobile?.id}/files/${fotoInMovimento}`,
                firstName: foto!.nome!,
                secondName: immobile?.files?.find(
                    (el) => el.id === fotoInMovimento
                )?.nome!,
            })
        );
    };

    return (
        <div
            className={`${styles.frame} centered ${
                fotoInMovimento === foto.id ? styles.over : ""
            }`}
        >
            {showLoading && <IonSpinner color="primary"></IonSpinner>}
            {!showLoading && (
                <>
                    <img
                        onTouchStart={inizializzaMovimento}
                        onTouchCancel={resetMovimento}
                        onTouchEnd={resetMovimento}
                        onDragEnter={gestisciFotoInSostituzione}
                        onDragEnd={sostituisciFoto}
                        draggable
                        onClick={() =>
                            !isSelectionModeActivated
                                ? null
                                : isSelected
                                ? dispatch(deselectPhoto(foto.id!))
                                : dispatch(selectPhoto(foto.id!))
                        }
                        src={
                            foto.base64String !== "blockPhoto"
                                ? foto.base64String
                                : notAvailable
                        }
                        className={`${styles.image} ${
                            isSelected
                                ? styles.isSelected
                                : isSelectionModeActivated
                                ? styles.isNotSelected
                                : ""
                        } `}
                        alt="Immagine non disponibile 😱😱😱"
                    />
                    {!isSelectionModeActivated &&
                        !fotoInMovimento &&
                        foto.nome !== "0" &&
                        foto.base64String !== "blockPhoto" && (
                            <>
                                <IonFab
                                    vertical="bottom"
                                    horizontal="start"
                                    slot="fixed"
                                >
                                    <IonFabButton
                                        size="small"
                                        color="light"
                                        onClick={() => setRotatingSense("-90")}
                                    >
                                        <IonIcon icon={arrowUndoOutline} />
                                    </IonFabButton>
                                </IonFab>
                                <IonFab
                                    vertical="bottom"
                                    horizontal="end"
                                    slot="fixed"
                                >
                                    <IonFabButton
                                        size="small"
                                        color="light"
                                        onClick={() => setRotatingSense("90")}
                                    >
                                        <IonIcon icon={arrowRedoOutline} />
                                    </IonFabButton>
                                </IonFab>
                            </>
                        )}
                    {isSelectionModeActivated && (
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton size="small" color="light">
                                {isSelected && (
                                    <IonIcon
                                        color="primary"
                                        icon={checkmarkSharp}
                                    />
                                )}
                            </IonFabButton>
                        </IonFab>
                    )}
                </>
            )}
        </div>
    );
};

export default ImmobiliPhoto;
