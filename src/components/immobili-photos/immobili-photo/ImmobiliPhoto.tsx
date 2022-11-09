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
import { erasePhoto, setPhoto } from "../../../store/immobile-slice";
import { swapPhotoPositions } from "../../../store/immobile-thunk";
import axiosInstance from "../../../utils/axiosInstance";
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

    const [update, setUpdate] = useState<number>(0);

    const immobile = useAppSelector((state) => state.immobile.immobile);

    useEffect(() => {
        const selectFile = async () => {
            const url = `immobili/${props.idImmobile}/files/${props.foto.id}`;
            try {
                const res = await axiosInstance.get(url);
                dispatch(
                    setPhoto({
                        id: props.foto.id!,
                        byteArray: res.data.byteArray,
                    })
                );
                setShowLoading(false);
            } catch (e) {
                setShowLoading(false);
                errorHandler(
                    e,
                    () => {},
                    "Apertura della foto non riuscita",
                    presentAlert
                );
            }
        };

        let timeout: any = null;
        if (
            !immobile?.files?.find((el) => el.id === props.foto.id)
                ?.base64String
        ) {
            setShowLoading(true);
            timeout = setTimeout(() => {
                selectFile();
            }, 2000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [
        props.foto.id,
        props.foto.codiceBucket,
        props.idImmobile,
        presentAlert,
        dispatch,
        update,
        immobile?.files,
    ]);

    useEffect(() => {
        const rotatePhoto = async () => {
            props.bloccaSelezione(true);
            setShowLoading(true);
            try {
                const reqBody = { rotating: +rotating! };
                const url = `/immobili/${props.idImmobile}/files/${props.foto.id}`;
                await axiosSecondaryApi.patch(url, reqBody);
                setRotating(null);
                dispatch(erasePhoto({ id: props.foto.id! }));
                setTimeout(() => {
                    setUpdate((prevState) => ++prevState);
                    props.bloccaSelezione(false);
                }, 2000);
            } catch (e) {
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
                        src={
                            immobile?.files?.find(
                                (el) => el.id === props.foto.id
                            )?.base64String
                        }
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
