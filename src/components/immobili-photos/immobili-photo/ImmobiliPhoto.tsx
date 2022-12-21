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
import { Documento } from "../../../entities/documento.model";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { erasePhoto } from "../../../store/immobile-slice";
import {
    fetchFileById,
    swapPhotoPositions,
} from "../../../store/immobile-thunk";
import axiosSecondaryApi from "../../../utils/axiosSecondaryApi";
import errorHandler from "../../../utils/errorHandler";
import styles from "./ImmobiliPhoto.module.css";

const ImmobiliPhoto: React.FC<{
    foto: Documento;
    idImmobile: string;
    selectionMode: boolean;
    selectPhoto: (id: number) => void;
    deselectPhoto: (id: number) => void;
    isSelected: boolean;
    bloccaSelezione: (input: boolean) => void;
}> = (props) => {
    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [rotating, setRotating] = useState<null | "90" | "-90">(null);

    const base64String = useAppSelector(
        (state) =>
            state.immobile.immobile?.files?.find(
                (el) => el.id === props.foto.id
            )?.base64String
    );

    useEffect(() => {
        setShowLoading(base64String === "fetching");
    }, [base64String]);

    useEffect(() => {
        let mounted = true;
        let timeOut: NodeJS.Timeout | null = null;

        const rotatePhoto = async () => {
            props.bloccaSelezione(true);
            setShowLoading(true);
            try {
                const reqBody = { rotating: +rotating! };
                const url = `/immobili/${props.idImmobile}/files/${props.foto.id}`;
                await axiosSecondaryApi.patch(url, reqBody);
                if (!mounted) return;
                setRotating(null);
                dispatch(erasePhoto({ id: props.foto.id! }));
                timeOut = setTimeout(() => {
                    setShowLoading(false);
                    dispatch(
                        fetchFileById(
                            `/immobili/${props.idImmobile}/files/${props.foto.id}`
                        )
                    );
                    props.bloccaSelezione(false);
                }, 2000);
            } catch (e) {
                if (!mounted) return;
                setRotating(null);
                setShowLoading(false);
                props.bloccaSelezione(false);
                errorHandler(
                    e,
                    () => {},
                    "Rotazione non riuscita",
                    presentAlert
                );
            }
        };

        if (rotating) rotatePhoto();

        return () => {
            mounted = false;
            if (timeOut) clearTimeout(timeOut);
        };
    }, [rotating, props, presentAlert, dispatch]);

    const [, dragRef] = useDrag({
        type: "photo",
        item: { id: props.foto.id, name: props.foto.nome },
    });

    const [{ isOver }, dropRef] = useDrop({
        accept: "photo",
        drop: (item: { id: number; name: string }) => {
            if (props.foto.nome === "0" || item.name === "0") {
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
            } else if (item.id !== props.foto.id)
                dispatch(
                    swapPhotoPositions({
                        url: `/immobili/${props.idImmobile}/files/${item.id}`,
                        name: props.foto.nome!,
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
            ref={!props.selectionMode ? dropRef : undefined}
        >
            {showLoading && <IonSpinner color="primary"></IonSpinner>}
            {!showLoading && (
                <>
                    <img
                        ref={dragRef}
                        onClick={() =>
                            !props.selectionMode
                                ? null
                                : props.isSelected
                                ? props.deselectPhoto(props.foto.id!)
                                : props.selectPhoto(props.foto.id!)
                        }
                        src={base64String}
                        className={`${styles.image} ${
                            props.isSelected
                                ? styles.isSelected
                                : props.selectionMode
                                ? styles.isNotSelected
                                : ""
                        } `}
                        alt="Immagine non disponibile 😱😱😱"
                    />
                    {!props.selectionMode && props.foto.nome !== "0" && (
                        <>
                            <IonFab
                                vertical="bottom"
                                horizontal="start"
                                slot="fixed"
                            >
                                <IonFabButton
                                    size="small"
                                    color="light"
                                    onClick={() => setRotating("-90")}
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
                                    onClick={() => setRotating("90")}
                                >
                                    <IonIcon icon={arrowRedoOutline} />
                                </IonFabButton>
                            </IonFab>
                        </>
                    )}
                    {props.selectionMode && (
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton size="small" color="light">
                                {props.isSelected && (
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
