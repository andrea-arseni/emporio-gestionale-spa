import {
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    pencilOutline,
    personAddOutline,
    trashOutline,
} from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { Entity } from "../../entities/entity";
import { Evento } from "../../entities/evento.model";
import useInput from "../../hooks/use-input";
import { getDateAndTime } from "../../utils/timeUtils";
import ItemOption from "./ItemOption";
import { getInterestMessage } from "../../utils/messageUtils";
import { useAppSelector } from "../../hooks";
import { Immobile } from "../../entities/immobile.model";
import { checkShareability } from "../../utils/fileUtils";
import errorHandler from "../../utils/errorHandler";
import { isNativeApp, saveContact } from "../../utils/contactUtils";
import ModalMessage from "../modal/modal-message/ModalMessage";
import { isUserAdmin } from "../../utils/userUtils";
import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";

const ListEventi: React.FC<{
    eventi: Evento[];
    setCurrentEntity: Dispatch<SetStateAction<Entity | null>>;
    setMode: Dispatch<SetStateAction<"list" | "form">>;
    deleteEntity: (type: string, id: string, message?: string) => void;
    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;
    closeItems: () => void;
}> = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const persona = useAppSelector((state) => state.persona.persona);

    const [currentImmobile, setCurrentImmobile] = useState<Immobile | null>(
        null
    );

    const [presentAlert] = useIonAlert();

    const userData = useAppSelector((state) => state.auth.userData);

    const sendInterestMessage = async () => {
        if (!checkShareability(presentAlert)) return;

        try {
            await SocialSharing.shareWithOptions({
                message: inputNoteValue,
                url:
                    process.env.REACT_APP_PUBLIC_WEBSITE_URL! +
                    currentImmobile!.id!,
                subject: "Interessamento Immobile",
            });
        } catch (error) {
            errorHandler(
                null,
                () => {},
                `Condivisione testo non riuscita.`,
                presentAlert
            );
        }
    };

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
    } = useInput(() => true, "");

    const apriModale = (immobile: Immobile) => {
        setCurrentImmobile(immobile);
        inputNoteChangedHandler(
            null,
            getInterestMessage(persona!, immobile, userData!)
        );
        setModalIsOpen(true);
        props.closeItems();
    };

    const getColor = (evento: Evento) => {
        let matchFound: boolean = false;
        const paroleChiave = [
            "Visita modificata: ora fissata il",
            "Visita annullata",
            "Visita fissata il ",
        ];
        paroleChiave.forEach((el) => {
            if (evento.descrizione?.includes(el)) matchFound = true;
        });
        return matchFound ? "tertiary" : undefined;
    };

    const getDescrizione = (evento: Evento) => {
        if (
            evento.descrizione &&
            evento.descrizione.indexOf("[") === 0 &&
            evento.descrizione.includes("]")
        ) {
            const primaParte = evento.descrizione
                .substring(1)
                .split("]")[0]
                .trim();
            const secondaParte = evento.descrizione.split("]")[1].trim();
            return (
                <>
                    <p style={{ color: "#3880ff" }}>
                        Status cambiato: {primaParte}
                    </p>
                    <h2>{secondaParte}</h2>
                </>
            );
        }
        return <h2>{evento.descrizione}</h2>;
    };

    return (
        <>
            {props.eventi.map((evento: Evento) => {
                return (
                    <IonItemSliding key={evento.id!} id={evento.id?.toString()}>
                        <IonItem detail color={getColor(evento)}>
                            <IonLabel text-wrap>
                                <p>{`${getDateAndTime(evento.data!)} ${
                                    evento.user && evento.user.name
                                        ? `inserito da ${evento.user.name}`
                                        : ""
                                }`}</p>
                                {getDescrizione(evento)}
                                {evento.immobile && (
                                    <>
                                        <p
                                            style={{
                                                color: "var(--ion-color-primary)",
                                            }}
                                        >{`Interessato al Ref. ${evento.immobile.ref}: ${evento.immobile.titolo}`}</p>
                                        <p>{`${evento.immobile.indirizzo} (${evento.immobile.comune})`}</p>
                                    </>
                                )}
                            </IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            {isNativeApp && (
                                <ItemOption
                                    handler={() => {
                                        props.closeItems();
                                        saveContact(presentAlert, persona!);
                                    }}
                                    colorType={"dark"}
                                    icon={personAddOutline}
                                    title={"Rubrica"}
                                />
                            )}
                            {evento.immobile && (
                                <ItemOption
                                    handler={() => apriModale(evento.immobile!)}
                                    colorType={"success"}
                                    icon={pencilOutline}
                                    title={"Scrivi"}
                                />
                            )}
                            <ItemOption
                                handler={() => {
                                    props.setCurrentEntity(evento);
                                    props.setMode("form");
                                }}
                                colorType={"light"}
                                icon={createOutline}
                                title={"Modifica"}
                            />
                            {isUserAdmin(userData) && (
                                <ItemOption
                                    handler={() =>
                                        props.deleteEntity(
                                            "eventi",
                                            evento.id!.toString(),
                                            `Hai selezionato la cancellazione dell'evento. Si tratta di un processo irreversibile. Lo status della persona non verrà modificato.`
                                        )
                                    }
                                    colorType={"danger"}
                                    icon={trashOutline}
                                    title={"Elimina"}
                                />
                            )}
                        </IonItemOptions>
                    </IonItemSliding>
                );
            })}
            <ModalMessage
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                handler={sendInterestMessage}
                inputValue={inputNoteValue}
                inputTouchedHandler={inputNoteTouchedHandler}
                inputChangedHandler={inputNoteChangedHandler}
                inputIsInvalid={inputNoteIsInvalid}
            />
        </>
    );
};

export default ListEventi;
