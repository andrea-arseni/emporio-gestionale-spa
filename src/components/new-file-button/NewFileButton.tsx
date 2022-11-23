import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { cameraSharp, documentsSharp, podiumSharp } from "ionicons/icons";
import { useAppSelector } from "../../hooks";
import { fileMode } from "../../pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";

const NewFileButton: React.FC<{
    mode: fileMode;
    action: () => void;
    selectionMode: boolean;
    listIdPhotoSelected: number[] | null;
}> = (props) => {
    const immobile = useAppSelector((state) => state.immobile.immobile);

    const isImmobileClosed = immobile?.files?.find(
        (el) => el.nome === "0" && el.tipologia === "FOTO"
    );

    const numeroFoto = immobile?.files?.filter(
        (el) => el.tipologia === "FOTO" && el.nome !== "0"
    ).length;

    return (
        <IonButton
            color={
                props.selectionMode ||
                (isImmobileClosed && props.mode === "foto")
                    ? "dark"
                    : "primary"
            }
            expand="full"
            mode="ios"
            fill="solid"
            style={{ margin: 0 }}
            onClick={props.action}
            disabled={
                props.selectionMode ||
                (props.mode === "foto" &&
                    !isImmobileClosed &&
                    numeroFoto! >= 30)
            }
        >
            <IonIcon
                icon={
                    props.mode === "files"
                        ? documentsSharp
                        : props.mode === "foto"
                        ? cameraSharp
                        : podiumSharp
                }
            />
            <IonLabel style={{ paddingLeft: "16px" }}>
                {props.selectionMode
                    ? `Foto Selezionate: ${
                          props.listIdPhotoSelected &&
                          props.listIdPhotoSelected.length
                              ? props.listIdPhotoSelected.length
                              : 0
                      } su ${numeroFoto}`
                    : props.mode === "files"
                    ? "Nuovi File"
                    : props.mode === "foto" && isImmobileClosed
                    ? "Riattiva Immobile"
                    : props.mode === "foto" && numeroFoto! >= 30
                    ? "Raggiunto limite di 30 foto"
                    : props.mode === "foto"
                    ? `Nuove Foto - ${numeroFoto} su 30 spazi disponibili`
                    : `Crea Nuovo Report`}
            </IonLabel>
        </IonButton>
    );
};

export default NewFileButton;
