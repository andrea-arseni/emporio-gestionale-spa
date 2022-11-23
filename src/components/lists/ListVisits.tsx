import {
    IonItemSliding,
    IonItemOptions,
    IonItem,
    IonLabel,
    IonList,
    useIonAlert,
} from "@ionic/react";
import {
    createOutline,
    trashOutline,
    pencilOutline,
    personAddOutline,
} from "ionicons/icons";
import { useState } from "react";
import { Persona } from "../../entities/persona.model";
import { Visit } from "../../entities/visit.model";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useInput from "../../hooks/use-input";
import useList from "../../hooks/use-list";
import { setCurrentVisit, setFormActive } from "../../store/appuntamenti-slice";
import { alertEliminaVisita } from "../../store/appuntamenti-thunk";
import capitalize from "../../utils/capitalize";
import { isNativeApp, saveContact } from "../../utils/contactUtils";
import errorHandler from "../../utils/errorHandler";
import { checkShareability } from "../../utils/fileUtils";
import { Share } from "@capacitor/share";
import { getConfermaVisitaMessage } from "../../utils/messageUtils";
import { isUserAdmin } from "../../utils/userUtils";
import Card from "../card/Card";
import ModalMessage from "../modal/modal-message/ModalMessage";
import ItemOption from "./ItemOption";
import styles from "./Lists.module.css";
import { getDayName, isPast } from "../../utils/timeUtils";

const ListVisits: React.FC<{
    visits: Visit[];
    displayDay?: boolean;
    deleteEntity?: (type: string, id: string, message?: string) => void;
}> = (props) => {
    const userData = useAppSelector((state) => state.auth.userData);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { list, closeItemsList } = useList();

    const [presentAlert] = useIonAlert();

    const dispatch = useAppDispatch();

    const currentVisit = useAppSelector(
        (state) => state.appuntamenti.currentVisit
    );

    const {
        inputValue: inputNoteValue,
        inputTouchedHandler: inputNoteTouchedHandler,
        inputChangedHandler: inputNoteChangedHandler,
        inputIsInvalid: inputNoteIsInvalid,
    } = useInput(() => true, "");

    const apriModale = (visita: Visit) => {
        inputNoteChangedHandler(
            null,
            getConfermaVisitaMessage(visita, userData!)
        );
        setModalIsOpen(true);
        closeItemsList();
    };

    const modificaVisita = (visita: Visit) => {
        dispatch(setCurrentVisit(visita));
        dispatch(setFormActive(true));
    };

    const eliminaVisita = (visita: Visit) => {
        if (props.deleteEntity === undefined) {
            dispatch(setCurrentVisit(visita));
            dispatch(alertEliminaVisita({ presentAlert, closeItemsList }));
        } else {
            props.deleteEntity(
                "visite",
                visita.id!.toString(),
                `Hai selezionato la cancellazione della visita selezionata. Si tratta di un processo irreversibile.`
            );
        }
    };

    const sendConfirmationMessage = async () => {
        if (!checkShareability(presentAlert)) return;

        try {
            await Share.share({
                text: inputNoteValue,
                url: currentVisit!.immobile
                    ? process.env.REACT_APP_PUBLIC_WEBSITE_URL! +
                      currentVisit!.immobile.id!
                    : undefined,
                dialogTitle: "Conferma Visita",
                title: "Messaggio",
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

    const getLuogo = (visit: Visit) =>
        visit.dove
            ? visit.dove
            : visit.immobile
            ? `${visit.immobile.indirizzo} (${visit.immobile.comune})`
            : "";

    const getPersonaContatto = (persona: Persona) => {
        return (
            <p>
                {persona.telefono ? (
                    <a href={`tel:${persona.telefono}`}>{persona.telefono}</a>
                ) : (
                    "Telefono mancante"
                )}
            </p>
        );
    };

    const getVisitItem = (visit: Visit) => {
        return (
            <IonItem key={visit.id} detail>
                <IonLabel text-wrap>
                    {props.displayDay && (
                        <h3>{getDayName(new Date(visit.quando!), "long")}</h3>
                    )}
                    <h3>{`Ore ${visit.quando
                        ?.split("T")[1]
                        .substring(0, 5)} - ${capitalize(
                        visit.user!.name!
                    )}`}</h3>
                    <h2>
                        {`${
                            visit.persona ? capitalize(visit.persona.nome!) : ""
                        }${
                            visit.immobile
                                ? ` visita ref. ${
                                      visit.immobile.ref
                                  } - ${getLuogo(visit)}`
                                : ""
                        }`}
                    </h2>
                    {visit.persona && getPersonaContatto(visit.persona)}
                    {visit.note && <p>{visit.note}</p>}
                    {!visit.persona && <br />}
                    {!visit.note && <br />}
                </IonLabel>
            </IonItem>
        );
    };

    const getVisitComplete = (visit: Visit) => {
        return (
            <IonItemSliding key={visit.id!} id={visit.id?.toString()}>
                {getVisitItem(visit)}
                <IonItemOptions side="end">
                    {visit.persona && isNativeApp && (
                        <ItemOption
                            handler={() =>
                                saveContact(presentAlert, visit.persona!)
                            }
                            colorType={"dark"}
                            icon={personAddOutline}
                            title={"Aggiungi"}
                        />
                    )}
                    {!isPast(new Date(visit.quando!)) && (
                        <ItemOption
                            handler={() => apriModale(visit)}
                            colorType={"success"}
                            icon={pencilOutline}
                            title={"Scrivi"}
                        />
                    )}
                    <ItemOption
                        handler={() => modificaVisita(visit)}
                        colorType={"light"}
                        icon={createOutline}
                        title={"Modifica"}
                    />
                    {isUserAdmin(userData) && (
                        <ItemOption
                            handler={() => eliminaVisita(visit)}
                            colorType={"danger"}
                            icon={trashOutline}
                            title={"Elimina"}
                        />
                    )}
                </IonItemOptions>
            </IonItemSliding>
        );
    };

    if (props.visits.length === 0) {
        return (
            <div className={`centered`} style={{ height: "200px" }}>
                <Card
                    subTitle={`Non sono presenti visite`}
                    title={"Non sono state trovate visite per questo giorno"}
                />
            </div>
        );
    }

    return (
        <>
            <IonList
                ref={list}
                className={`${styles.list} ${
                    !props.displayDay ? styles.listVisit : ""
                }`}
            >
                {props.visits.map((visit) => getVisitComplete(visit))}
            </IonList>
            <ModalMessage
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                handler={sendConfirmationMessage}
                inputValue={inputNoteValue}
                inputTouchedHandler={inputNoteTouchedHandler}
                inputChangedHandler={inputNoteChangedHandler}
                inputIsInvalid={inputNoteIsInvalid}
            />
        </>
    );
};

export default ListVisits;
