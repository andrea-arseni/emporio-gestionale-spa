import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Documento } from "../../entities/documento.model";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "../card/Card";
import ImmobiliPhoto from "./immobili-photo/ImmobiliPhoto";
import styles from "./ImmobiliPhotos.module.css";

const ImmobiliPhotos: React.FC<{
    foto: Documento[];
    idImmobile: string;
    selectionMode: boolean;
    setSelectionMode: Dispatch<SetStateAction<boolean>>;
    listIdPhotoSelected: number[] | null;
    setListIdPhotoSelected: Dispatch<SetStateAction<number[] | null>>;
}> = (props) => {
    const [selectionStop, setSelectionStop] = useState<boolean>(false);

    const bloccaSelezione = useCallback(
        (input: boolean) => setSelectionStop(input),
        []
    );

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

    if (props.foto.length === 0)
        return (
            <Card
                subTitle={`Questo immobile non ha ancora foto associate`}
                title={"Non sono ancora presenti foto"}
            />
        );

    const getSize = (type: "xl" | "lg" | "md" | "sm" | "xs") => {
        if (props.foto.length === 1 || type === "xs") return "12";
        if (props.foto.length === 2 || type === "sm") return "6";
        if (props.foto.length === 3 || type === "md") return "4";
        if (props.foto.length === 4 || type === "lg") return "3";
        return "2";
    };

    const areAllPhotoPresent = () => props.foto.every((el) => el.base64String);

    const getFrames = () =>
        props.foto
            .sort((a, b) => +a.nome! - +b.nome!)
            .map((el) => {
                return (
                    <IonCol
                        className={styles.col}
                        key={el.id}
                        sizeXl={getSize("xl")}
                        sizeLg={getSize("lg")}
                        sizeMd={getSize("md")}
                        sizeSm={getSize("sm")}
                        sizeXs={getSize("xs")}
                    >
                        <ImmobiliPhoto
                            foto={el}
                            idImmobile={props.idImmobile}
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
        <IonGrid className={styles.grid}>
            {!selectionStop && areAllPhotoPresent() && (
                <button
                    className={styles.selectionButton}
                    onClick={() =>
                        props.setSelectionMode((prevState) => !prevState)
                    }
                >
                    {props.selectionMode ? "ANNULLA" : "SELEZIONA"}
                </button>
            )}
            {props.selectionMode && (
                <div className={styles.selectionInfo}>{`Foto selezionate ${
                    props.listIdPhotoSelected
                        ? props.listIdPhotoSelected!.length
                        : 0
                } su ${props.foto.length}`}</div>
            )}
            <IonRow className={styles.simple}>
                <DndProvider backend={HTML5Backend}>{getFrames()}</DndProvider>
            </IonRow>
        </IonGrid>
    );
};

export default ImmobiliPhotos;
