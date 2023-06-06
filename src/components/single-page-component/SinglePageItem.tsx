import { IonButton } from "@ionic/react";
import { Immobile } from "../../entities/immobile.model";
import { Persona } from "../../entities/persona.model";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { setImmobile } from "../../store/immobile-slice";
import { setPersona } from "../../store/persona-slice";
import { capitalize } from "../../utils/stringUtils";

const SinglePageItem: React.FC<{
    titolo: string;
    type: "immobili" | "persone";
    entities: Immobile[] | Persona[];
}> = (props) => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const goToEntity = (el: Immobile | Persona) => {
        dispatch(
            props.type === "immobili"
                ? setImmobile(el as Immobile)
                : setPersona(el as Persona)
        );
        navigate(`/${props.type}/${el.id}`);
    };

    const getItemText = (el: Immobile | Persona) => {
        if (props.type === "immobili") {
            el = el as Immobile;
            return `Ref. ${el.ref} - ${el.indirizzo} (${el.comune})`;
        } else {
            el = el as Persona;
            return `${el.nome
                ?.split(" ")
                .map((el) => capitalize(el))
                .join(" ")} ${el.ruolo ? ` - ${el.ruolo}` : ""}`;
        }
    };

    return (
        <div className="singlePageItem">
            <h4 style={{ color: "rgb(7, 110, 245)", marginTop: "20px" }}>
                {props.titolo}
            </h4>

            <div className=" centered vertical">
                {props.entities.map((el) => (
                    <div key={el.id} className="centered">
                        <p>{getItemText(el)}</p>
                        <IonButton
                            size="small"
                            color="secondary"
                            onClick={() => goToEntity(el)}
                        >
                            Apri
                        </IonButton>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SinglePageItem;
