import {
    IonButton,
    IonContent,
    IonIcon,
    IonLabel,
    IonLoading,
    useIonAlert,
} from "@ionic/react";
import { documentsOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import FormTitle from "../../../components/form-components/form-title/FormTitle";
import DocumentoForm from "../../../components/forms/documento-form/DocumentoForm";
import Selector from "../../../components/selector/Selector";
import { Documento } from "../../../entities/documento.model";
import { Entity } from "../../../entities/entity";
import useQueryData from "../../../hooks/use-query-data";
import { submitFile } from "../../../utils/fileUtils";

const DocumentiPage: React.FC<{}> = () => {
    const [mode, setMode] = useState<"list" | "form">("list");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const [presentAlert] = useIonAlert();

    const inputFileRef = useRef<any>();

    const queryData = useQueryData("documenti");

    const [currentDocumento, setCurrentDocumento] = useState<Entity | null>(
        null
    );

    const backToList = () => {
        setMode("list");
        setCurrentDocumento(null);
    };

    return (
        <div className="page">
            {mode === "list" && (
                <IonContent>
                    <IonLoading cssClass="loader" isOpen={showLoading} />
                    <IonButton
                        color="primary"
                        expand="full"
                        mode="ios"
                        fill="solid"
                        style={{ margin: 0 }}
                        onClick={() => inputFileRef.current.click()}
                    >
                        <IonIcon icon={documentsOutline} />
                        <IonLabel style={{ paddingLeft: "16px" }}>
                            Nuovo Documento
                        </IonLabel>
                    </IonButton>
                    <input
                        style={{
                            display: "none",
                        }}
                        ref={inputFileRef}
                        type="file"
                        onChange={(e) =>
                            submitFile(
                                e,
                                setShowLoading,
                                presentAlert,
                                `/documenti`,
                                queryData.setUpdate
                            )
                        }
                    />

                    <Selector
                        setMode={setMode}
                        entitiesType="documenti"
                        setCurrentEntity={setCurrentDocumento}
                        queryData={queryData}
                    />
                </IonContent>
            )}
            {mode === "form" && (
                <IonContent>
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
                </IonContent>
            )}
        </div>
    );
};

export default DocumentiPage;
