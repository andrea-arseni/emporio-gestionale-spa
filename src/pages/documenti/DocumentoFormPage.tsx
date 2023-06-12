import { useLocation, useNavigate } from "react-router-dom";
import DocumentoForm from "../../components/forms/documento-form/DocumentoForm";
import { useAppSelector } from "../../hooks";

const DocumentoFormPage: React.FC<{}> = () => {
    const navigate = useNavigate();

    const documento = useAppSelector(
        (state) => state.documento.currentDocumento
    );

    const backToList = () => navigate(-1);

    const location = useLocation();

    const produceBaseUrl = () => {
        const originalUrlParts = location.pathname.split("/");
        originalUrlParts.pop();
        originalUrlParts.pop();
        return originalUrlParts.join("/");
    };

    return (
        <DocumentoForm
            documento={documento}
            backToList={backToList}
            baseUrl={produceBaseUrl()}
        />
    );
};

export default DocumentoFormPage;
