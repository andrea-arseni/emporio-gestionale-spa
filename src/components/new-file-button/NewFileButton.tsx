import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { cameraSharp, documentsSharp, podiumSharp } from "ionicons/icons";
import { useAppSelector } from "../../hooks";
import { fileMode } from "../../pages/immobili/ImmobiliFilesPage/ImmobiliFilesPage";

const NewFileButton: React.FC<{
    mode: fileMode;
    action: () => void;
}> = (props) => {
    const immobile = useAppSelector((state) => state.immobile.immobile);

    const numeroFoto = immobile?.files?.filter(
        (el) => el.tipologia === "FOTO"
    ).length;

    return (
        <IonButton
            color="primary"
            expand="full"
            mode="ios"
            fill="solid"
            style={{ margin: 0 }}
            onClick={props.action}
            disabled={props.mode === "foto" && numeroFoto! >= 20}
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
                {props.mode === "files"
                    ? "Nuovi File"
                    : props.mode === "foto" && numeroFoto! >= 20
                    ? "Raggiunto limite di 20 foto"
                    : props.mode === "foto"
                    ? `Nuove Foto - ${numeroFoto} su 20 spazi disponibili`
                    : `Crea Nuovo Report`}
            </IonLabel>
        </IonButton>
    );
};

export default NewFileButton;
