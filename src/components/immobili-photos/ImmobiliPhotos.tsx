import {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonLabel,
    useIonAlert,
} from "@ionic/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../card/Card";
import ImmobiliPhoto from "./immobili-photo/ImmobiliPhoto";
import styles from "./ImmobiliPhotos.module.css";
import { ribbonOutline } from "ionicons/icons";
import errorHandler from "../../utils/errorHandler";
import axiosSecondaryApi from "../../utils/axiosSecondaryApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeLoading } from "../../store/ui-slice";
import { fetchFotoFirmata } from "../../store/immobile-thunk";

const ImmobiliPhotos: React.FC<{
    selectionMode: boolean;
    setSelectionMode: Dispatch<SetStateAction<boolean>>;
    listIdPhotoSelected: number[] | null;
    setListIdPhotoSelected: Dispatch<SetStateAction<number[] | null>>;
}> = (props) => {
    const [selectionStop, setSelectionStop] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const immobile = useAppSelector((state) => state.immobile.immobile);

    const foto = !immobile
        ? []
        : immobile.files
        ? immobile.files.filter((el) => el.tipologia === "FOTO")
        : [];

    const excludeFirstFotoIfSigned = () => {
        if (foto.find((el) => el.nome === "0")) {
            foto.sort((a, b) => +a.nome! - +b.nome!);
            foto.splice(1, 1);
        }
    };

    excludeFirstFotoIfSigned();

    const showSelectAll = foto.length !== props.listIdPhotoSelected?.length;

    const bloccaSelezione = useCallback(
        (input: boolean) => setSelectionStop(input),
        []
    );

    const selectAllPhotos = () => {
        props.setListIdPhotoSelected(foto.map((el) => el.id!));
    };

    const selectPhoto = (id: number) =>
        props.setListIdPhotoSelected((prevList) => {
            if (!prevList) return [id];
            const alreadyThere = prevList.find((el) => el === id);
            return alreadyThere ? [...prevList] : [...prevList, id];
        });

    const deselectPhoto = (id: number) =>
        props.setListIdPhotoSelected((prevList) =>
            prevList!.filter((el) => el !== id)
        );

    const dichiaraConcluso = async () => {
        try {
            const tipologia =
                immobile?.contratto === "vendita" ? "venduto" : "affittato";
            dispatch(changeLoading(true));
            await axiosSecondaryApi.patch(
                `/immobili/${immobile!.id}/concluso`,
                { tipologia, colore: Math.random() > 0.5 ? "blue" : "red" }
            );
            setTimeout(() => {
                dispatch(fetchFotoFirmata(immobile!.id!));
            }, 500);
        } catch (e) {
            dispatch(changeLoading(false));
            errorHandler(e, () => {}, "Procedura non riuscita", presentAlert);
        }
    };

    if (foto.length === 0)
        return (
            <Card
                subTitle={`Questo immobile non ha ancora foto associate`}
                title={"Non sono ancora presenti foto"}
            />
        );

    const getSize = (type: "xl" | "lg" | "md" | "sm" | "xs") => {
        if (foto.length === 1 || type === "xs") return "12";
        if (foto.length === 2 || type === "sm") return "6";
        if (foto.length === 3 || type === "md") return "4";
        return "3";
    };

    const isPhotoSignedPresent = foto.find((el) => el.nome === "0");

    const getFrames = () =>
        foto
            .sort((a, b) => +a.nome! - +b.nome!)
            .map((el) => {
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
                        <ImmobiliPhoto
                            foto={el}
                            idImmobile={immobile!.id!.toString()}
                            selectionMode={props.selectionMode}
                            selectPhoto={selectPhoto}
                            deselectPhoto={deselectPhoto}
                            isSelected={
                                !!props.listIdPhotoSelected &&
                                !!props.listIdPhotoSelected.find(
                                    (id) => el.id === id
                                )
                            }
                            bloccaSelezione={bloccaSelezione}
                        />
                    </IonCol>
                );
            });

    return (
        <div>
            {!isPhotoSignedPresent && (
                <IonButton
                    color="dark"
                    expand="full"
                    mode="ios"
                    fill="solid"
                    style={{ margin: 0 }}
                    onClick={dichiaraConcluso}
                >
                    <IonIcon icon={ribbonOutline} />
                    <IonLabel style={{ paddingLeft: "16px" }}>
                        Dichiara Concluso
                    </IonLabel>
                </IonButton>
            )}
            <IonGrid className={styles.grid}>
                {!selectionStop && (
                    <button
                        className={`${styles.fabButton} ${styles.selectionButton}`}
                        onClick={() =>
                            props.setSelectionMode((prevState) => !prevState)
                        }
                    >
                        {props.selectionMode ? "ANNULLA" : "SELEZIONA"}
                    </button>
                )}
                {!selectionStop && props.selectionMode && showSelectAll && (
                    <button
                        className={`${styles.fabButton} ${styles.otherButton}`}
                        onClick={selectAllPhotos}
                    >
                        SELEZIONA TUTTE
                    </button>
                )}
                <IonRow
                    className={`${styles.row} ${
                        isPhotoSignedPresent
                            ? styles.heightLow
                            : styles.heightHigh
                    }`}
                >
                    <DndProvider backend={HTML5Backend}>
                        {getFrames()}
                    </DndProvider>
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default ImmobiliPhotos;
