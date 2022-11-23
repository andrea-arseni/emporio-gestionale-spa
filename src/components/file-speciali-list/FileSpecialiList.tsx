import { useEffect, useState } from "react";
import { Documento } from "../../entities/documento.model";
import axiosInstance from "../../utils/axiosInstance";
import { isFileSpecialePresent } from "../../utils/fileUtils";

const FileSpecialiList: React.FC<{ id: number }> = (props) => {
    const [files, setFiles] = useState<Documento[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;

        const fetchImmobile = async () => {
            try {
                const res = await axiosInstance.get(`/immobili/${props.id}`);
                if (!mounted) return;
                setFiles(res.data.files);
            } catch (e) {
                if (!mounted) return;
                setIsError(true);
            }
        };

        fetchImmobile();

        return () => {
            mounted = false;
        };
    }, [props.id]);

    if (isError)
        return (
            <div>
                <span>Dati Documenti </span>
                <br />
                <span>Non Disponibili </span>
            </div>
        );

    return (
        <div>
            <span
                className={
                    isFileSpecialePresent(files, "planimetria-catastale")
                        ? "active"
                        : "inactive"
                }
            >
                Planimetria
            </span>
            <br />
            <span
                className={
                    isFileSpecialePresent(files, "visura-catastale")
                        ? "active"
                        : "inactive"
                }
            >
                Visura
            </span>
            <br />
            <span
                className={
                    isFileSpecialePresent(files, "atto-provenienza")
                        ? "active"
                        : "inactive"
                }
            >
                Rogito
            </span>
            <br />
            <span
                className={
                    isFileSpecialePresent(files, "certificazione-energetica")
                        ? "active"
                        : "inactive"
                }
            >
                APE
            </span>
            <br />
            <span
                className={
                    isFileSpecialePresent(files, "consuntivo-spese")
                        ? "active"
                        : "inactive"
                }
            >
                Consuntivo Spese
            </span>
            <br />
            <span
                className={
                    isFileSpecialePresent(files, "contratto-collaborazione")
                        ? "active"
                        : "inactive"
                }
            >
                Esclusiva
            </span>
            <br />
        </div>
    );
};

export default FileSpecialiList;
