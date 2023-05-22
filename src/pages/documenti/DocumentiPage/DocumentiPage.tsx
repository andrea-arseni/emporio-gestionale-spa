import {
    IonButton,
    IonIcon,
    IonLabel,
    IonLoading,
    useIonAlert,
} from "@ionic/react";
import { documentsSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import DocumentoForm from "../../../components/forms/documento-form/DocumentoForm";
import Selector from "../../../components/selector/Selector";
import { Documento } from "../../../entities/documento.model";
import { Entity } from "../../../entities/entity";
import { useAppDispatch } from "../../../hooks";
import { triggerDocumentiUpdate } from "../../../store/documenti-slice";
import { submitFile } from "../../../utils/fileUtils";
import useErrorHandler from "../../../hooks/use-error-handler";

const DocumentiPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const { errorHandler } = useErrorHandler();

    const inputFileRef = useRef<any>();

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    const backToList = () => {
        setMode("list");
        setCurrentDocumento(null);
    };

    const dispatch = useAppDispatch();

    const [update, triggerUpdate] = useState<number>(0);

    useEffect(() => {
        dispatch(triggerDocumentiUpdate());
    }, [update, dispatch]);

    return (
        <>
            {mode === "list" && (
                <>
                    <IonLoading cssClass="loader" isOpen={showLoading} />
                    <IonButton
                        color="primary"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        style={{ margin: 0 }}
                        onClick={() => inputFileRef.current.click()}
                    >
                        <IonIcon icon={documentsSharp} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Nuovi Documenti
                        </IonLabel>
                    </IonButton>
                    <input
                        style={{
                            display: "none",
                        }}
                        multiple
                        ref={inputFileRef}
                        type="file"
                        onChange={(e) =>
                            submitFile(
                                e,
                                setShowLoading,
                                presentAlert,
                                errorHandler,
                                `/documenti`,
                                triggerUpdate
                            )
                        }
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="documenti"
                        setCurrentEntity={setCurrentDocumento}
                    />
                </>
            )}
            {mode === "form" && (
                <>
                    <FormTitle
                        title={
                            currentDocumento ? "Rinomina File" : "Nuovo File"
                        }
                        handler={() => setMode("list")}
                        backToList
                    />
                    <DocumentoForm
                        documento={currentDocumento as Documento}
                        backToList={backToList}
                        baseUrl={`/documenti`}
                    />
                </>
            )}
        </>
    );
};

export default DocumentiPage;
