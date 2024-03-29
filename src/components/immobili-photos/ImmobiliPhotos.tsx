import {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonLabel,
    isPlatform,
} from "@ionic/react";
import { useEffect } from "react";
import Card from "../card/Card";
import ImmobiliPhoto from "./immobili-photo/ImmobiliPhoto";
import styles from "./ImmobiliPhotos.module.css";
import { ribbonOutline } from "ionicons/icons";
import axiosSecondaryApi from "../../utils/axiosSecondaryApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeLoading } from "../../store/ui-slice";
import { fetchFileById, fetchFotoFirmata } from "../../store/immobile-thunk";
import { isNativeApp } from "../../utils/contactUtils";
import {
    resetMovingPhotos,
    setIsSelectionModeActivated,
    setListIdPhotoSelected,
} from "../../store/immobile-slice";
import useErrorHandler from "../../hooks/use-error-handler";
import { Filesystem, Directory } from "@capacitor/filesystem";
import localforage from "localforage";

const ImmobiliPhotos: React.FC<{}> = () => {
    const { errorHandler } = useErrorHandler();

    const dispatch = useAppDispatch();

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const isSelectionModeAllowed = useAppSelector(
        (state) => state.immobile.isSelectionModeAllowed
    );

    const isSelectionModeActivated = useAppSelector(
        (state) => state.immobile.isSelectionModeActivated
    );

    const fotoInMovimento = useAppSelector(
        (state) => state.immobile.startingPhotoId
    );

    const foto = immobile?.files
        ?.filter((el) => el.tipologia === "FOTO")
        .sort((a, b) => +a.nome! - +b.nome!);

    console.log(foto);

    const immobileId = immobile ? immobile.id : 0;

    const excludeFirstFotoIfSigned = () => {
        if (foto && foto.find((el) => el.nome === "0")) foto.splice(1, 1);
    };

    excludeFirstFotoIfSigned();

    const listIdPhotoSelected = useAppSelector(
        (state) => state.immobile.listIdPhotoSelected
    );

    const selectAllPhotos = () => {
        if (foto) dispatch(setListIdPhotoSelected(foto.map((el) => el.id!)));
    };

    const dichiaraConcluso = async () => {
        try {
            const tipologia =
                immobile?.contratto === "vendita" ? "venduto" : "affittato";
            dispatch(changeLoading(true));
            await axiosSecondaryApi.patch(
                `/immobili/${immobile!.id}/concluso`,
                { tipologia, colore: Math.random() > 0.5 ? "blue" : "red" }
            );
            try {
                if (isNativeApp) {
                    await Filesystem.deleteFile({
                        directory: Directory.Cache,
                        path: `/immobile/${immobileId}/avatar.jpg`,
                    });
                } else {
                    await localforage.removeItem(
                        `/immobile/${immobileId}/avatar.jpg`
                    );
                }
            } catch (e) {}
            setTimeout(() => {
                dispatch(fetchFotoFirmata(immobile!.id!));
            }, 500);
        } catch (e) {
            console.log(e);
            dispatch(changeLoading(false));
            errorHandler(e, "Procedura non riuscita");
        }
    };

    useEffect(() => {
        if (immobileId && foto)
            foto.forEach((el) => {
                if (!el.base64String && el.base64String !== "blockPhoto")
                    dispatch(
                        fetchFileById(`/immobili/${immobileId}/files/${el.id}`)
                    );
            });
    }, [immobileId, foto, dispatch]);

    const showSelectAll = foto && foto.length !== listIdPhotoSelected?.length;

    if (foto && foto.length === 0)
        return (
            <Card
                subTitle={`Questo immobile non ha ancora foto associate`}
                title={"Non sono ancora presenti foto"}
            />
        );

    const getSize = (type: "xl" | "lg" | "md" | "sm" | "xs") => {
        if ((foto && foto.length === 1) || type === "xs") return "12";
        if ((foto && foto.length === 2) || type === "sm") return "6";
        if ((foto && foto.length === 3) || type === "md") return "4";
        return "3";
    };

    const isPhotoSignedPresent = foto && foto.find((el) => el.nome === "0");

    const getPhotoCards = () =>
        foto &&
        foto.map((el) => {
            return (
                <IonCol
                    className="centered"
                    key={el.id}
                    sizeXl={getSize("xl")}
                    sizeLg={getSize("lg")}
                    sizeMd={getSize("md")}
                    sizeSm={getSize("sm")}
                    sizeXs={getSize("xs")}
                >
                    <ImmobiliPhoto id={el.id!} />
                </IonCol>
            );
        });

    return (
        <div
            className={`${
                isNativeApp && isPlatform("ios")
                    ? styles.heightIos
                    : styles.height
            }`}
        >
            {!isPhotoSignedPresent && (
                <IonButton
                    color="dark"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    style={{ margin: 0 }}
                    onClick={dichiaraConcluso}
                    disabled={!!fotoInMovimento}
                >
                    <IonIcon icon={ribbonOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Dichiara Concluso
                    </IonLabel>
                </IonButton>
            )}
            <IonGrid>
                <IonRow className={`${styles.row}`}>
                    {isSelectionModeAllowed && (
                        <button
                            className={`${styles.fabButton} ${styles.selectionButton}`}
                            onClick={() => {
                                fotoInMovimento
                                    ? dispatch(resetMovingPhotos())
                                    : dispatch(
                                          setIsSelectionModeActivated(
                                              !isSelectionModeActivated
                                          )
                                      );
                            }}
                        >
                            {fotoInMovimento || isSelectionModeActivated
                                ? "ANNULLA"
                                : "SELEZIONA"}
                        </button>
                    )}
                    {isSelectionModeAllowed &&
                        isSelectionModeActivated &&
                        showSelectAll && (
                            <button
                                className={`${styles.fabButton} ${styles.otherButton}`}
                                onClick={selectAllPhotos}
                            >
                                SELEZIONA TUTTE
                            </button>
                        )}
                    {getPhotoCards()}
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default ImmobiliPhotos;
