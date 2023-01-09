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
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
    deselectPhoto,
    erasePhoto,
    selectPhoto,
    setIsSelectionModeAllowed,
} from "../../../store/immobile-slice";
import {
    fetchFileById,
    swapPhotoPositions,
} from "../../../store/immobile-thunk";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import errorHandler from "../../../utils/errorHandler";
import styles from "./ImmobiliPhoto.module.css";

const ImmobiliPhoto: React.FC<{
    id: number;
}> = (props) => {
    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const isSelectionModeActivated = useAppSelector(
        (state) => state.immobile.isSelectionModeActivated
    );

    const idImmobile = useAppSelector((state) => state.immobile.immobile?.id);

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [rotatingSense, setRotatingSense] = useState<null | "90" | "-90">(
        null
    );

    const [isRotating, setIsRotating] = useState<boolean>(false);

    const foto = useAppSelector(
        (state) =>
            state.immobile.immobile?.files?.find((el) => el.id === props.id)!
    );

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
                const url = `/immobili/${idImmobile}/files/${props.id}`;
                await axiosSecondaryApi.patch(url, reqBody);
                if (!mounted) return;
                setRotatingSense(null);
                dispatch(erasePhoto({ id: props.id! }));
                timeOut = setTimeout(() => {
                    setShowLoading(false);
                    setIsRotating(false);
                    dispatch(
                        fetchFileById(
                            `/immobili/${idImmobile}/files/${props.id}`
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
                errorHandler(
                    e,
                    () => {},
                    "Rotazione non riuscita",
                    presentAlert
                );
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
        presentAlert,
        dispatch,
        idImmobile,
    ]);

    const [, dragRef] = useDrag({
        type: "photo",
        item: { id: props.id, name: foto.nome },
    });

    const [{ isOver }, dropRef] = useDrop({
        accept: "photo",
        drop: (item: { id: number; name: string }) => {
            if (foto.nome === "0" || item.name === "0") {
                presentAlert({
                    header: "Scambio non permesso",
                    message: `Non è possibile spostare una foto con la scritta.`,
                    buttons: [
                        {
                            text: "OK",
                            handler: () => {},
                        },
                    ],
                });
            } else if (item.id !== foto.id)
                dispatch(
                    swapPhotoPositions({
                        url: `/immobili/${idImmobile}/files/${item.id}`,
                        name: foto.nome!,
                    })
                );
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div
            className={`${styles.frame} centered ${isOver ? styles.over : ""}`}
            ref={!isSelectionModeActivated ? dropRef : undefined}
        >
            {showLoading && <IonSpinner color="primary"></IonSpinner>}
            {!showLoading && (
                <>
                    <img
                        ref={dragRef}
                        onClick={() =>
                            !isSelectionModeActivated
                                ? null
                                : isSelected
                                ? dispatch(deselectPhoto(foto.id!))
                                : dispatch(selectPhoto(foto.id!))
                        }
                        src={foto.base64String}
                        className={`${styles.image} ${
                            isSelected
                                ? styles.isSelected
                                : isSelectionModeActivated
                                ? styles.isNotSelected
                                : ""
                        } `}
                        alt="Immagine non disponibile 😱😱😱"
                    />
                    {!isSelectionModeActivated && foto.nome !== "0" && (
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
