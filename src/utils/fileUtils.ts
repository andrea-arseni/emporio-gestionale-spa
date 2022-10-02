import FileSaver from "file-saver";
import { Documento } from "../entities/documento.model";

export const getFileType = (fileName: string) => {
    const extension = fileName.split(".")[fileName.split(".").length - 1];
    if (extension === "jpeg" || extension === "jpg" || extension === "png")
        return "image";
    if (extension === "txt") return "text";
    if (extension === "pdf") return "pdf";
    if (extension === "doc" || extension === "docx" || extension === "odt")
        return "word";
    if (extension === "csv" || extension === "xls" || extension === "xlsx")
        return "excel";
    return "error";
};

const getMimeType = (nome: string) => {
    const extension = nome.split(".")[nome.split(".").length - 1];
    switch (extension) {
        case "jpeg":
            return "image/jpeg";
        case "jpg":
            return "image/jpg";
        case "png":
            return "image/png";
        case "pdf":
            return "application/pdf";
        case "txt":
            return "text/plain";
        case "csv":
            return "text/csv";
        case "xls":
            return "application/vnd.ms-excel";
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "doc":
            return "application/msword";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "odt":
            return "application/vnd.oasis.opendocument.text";
        default:
            return "error";
    }
};

const getBase64StringFromByteArray = (byteArray: string, nome: string) => {
    const mimeType = getMimeType(nome);
    return `data:${mimeType};base64,${byteArray}`;
};

export const downloadFile = (byteArray: string, documento: Documento) => {
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    FileSaver.saveAs(base64File, documento.nome!);
};
