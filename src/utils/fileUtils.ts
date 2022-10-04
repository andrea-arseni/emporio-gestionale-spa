import FileSaver from "file-saver";
import { Dispatch, SetStateAction } from "react";
import { Documento } from "../entities/documento.model";
import axiosInstance from "./axiosInstance";
import errorHandler from "./errorHandler";
import heic2any from "heic2any";
import Resizer from "react-image-file-resizer";

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

export const openFile = async (byteArray: string, documento: Documento) => {
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    const blob = await getBlobFromBase64String(base64File);
    const url = URL.createObjectURL(blob);
    window.open(url); /*  const a = document.createElement("a");
    a.setAttribute("href", blob);
    a.setAttribute("target", "_blank");
    a.click();
    document.removeChild(a);  */
};

export const shareFile = async (
    byteArray: string,
    documento: Documento,
    presentAlert: any
) => {
    if (!navigator.canShare) {
        errorHandler(
            null,
            () => {},
            "Questo Browser non permette la condivisione di file.",
            presentAlert
        );
        return;
    }
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    const blob = await (await fetch(base64File)).blob();
    const file = new File([blob], documento.nome!, { type: blob.type });

    if (!navigator.canShare({ files: [file] })) {
        errorHandler(
            null,
            () => {},
            "Il file selezionato non può essere condiviso.",
            presentAlert
        );
        return;
    }

    try {
        await navigator.share({
            files: [file],
        });
    } catch (error) {
        console.log(error);
    }
};

export const getFileNameWithoutExtension = (nome: string) => {
    const parti = nome.split(".");
    parti.pop();
    return parti.join(".");
};

export const getFileExtension = (nome: string) => nome.split(".").pop();

export const submitFile = async (
    e: any,
    setShowLoading: any,
    presentAlert: any,
    setUpdate: Dispatch<SetStateAction<number>>
) => {
    setShowLoading(true);
    let file: File | null = e.target.files![0];
    if (file!.type === "image/heic") {
        file = await convertHeichToJpeg(file!, presentAlert);
        if (!file) return;
    }
    const formData = new FormData();
    formData.append("file", file!);
    try {
        await axiosInstance.post(`/documenti`, formData);
        setShowLoading(false);
        presentAlert({
            header: "Ottimo",
            subHeader: `File '${file!.name}' aggiunto`,
            buttons: [
                {
                    text: "OK",
                    handler: () => setUpdate((prevState) => ++prevState),
                },
            ],
        });
    } catch (e) {
        setShowLoading(false);
        errorHandler(e, () => {}, "Procedura non riuscita", presentAlert);
    }
};

const convertHeichToJpeg = async (file: File, presentAlert: any) => {
    try {
        const blob = (await convertFileToBlob(file)) as Blob;
        const jpegBlob = await heic2any({
            blob,
            toType: "image/jpeg",
            quality: 1,
        });
        const jpegFile = getFileFromBlob(jpegBlob as Blob, file.name, "jpeg");
        const resizedFileBase64String = (await resizeImage(jpegFile)) as string;
        const resizedBlob = await getBlobFromBase64String(
            resizedFileBase64String
        );
        return getFileFromBlob(resizedBlob, file.name, "jpeg");
    } catch (e) {
        errorHandler(
            e,
            () => {},
            "Non è riuscita la conversione dell'immagine HEIC fornita",
            presentAlert
        );
        return null;
    }
};

const convertFileToBlob = async (file: File) =>
    new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

const getFileFromBlob = (blob: Blob, name: string, extension: string) =>
    new File([blob], getFileNameWithoutExtension(name) + "." + extension);

const getBlobFromBase64String = async (base64String: string) =>
    await (await fetch(base64String)).blob();

const resizeImage = (file: File) =>
    new Promise((resolve) =>
        Resizer.imageFileResizer(file, 1150, 1150, "JPEG", 100, 0, (uri) => {
            resolve(uri);
        })
    );
