import FileSaver from "file-saver";
import { Dispatch, SetStateAction } from "react";
import { Documento } from "../entities/documento.model";
import axiosInstance from "./axiosInstance";
import errorHandler from "./errorHandler";
import heic2any from "heic2any";
import Resizer from "react-image-file-resizer";
import capitalize from "./capitalize";
import { fileSpeciale, listFileSpeciali } from "../types/file_speciali";
import { getDayName } from "./timeUtils";
import { Share } from "@capacitor/share";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { isNativeApp } from "./contactUtils";

export const getFileType = (fileName: string) => {
    const extension = fileName
        .split(".")
        [fileName.split(".").length - 1].toLowerCase();
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

const getDate = (string: string) => new Date(string.split(" ").join("-"));

export const getReportName = (nome: string) => {
    nome = getFileNameWithoutExtension(nome);
    let [firstDate, secondDate] = nome.split("_");
    firstDate = getDayName(getDate(firstDate));
    secondDate = getDayName(getDate(secondDate));
    return `Da ${firstDate} a ${secondDate}`;
};

export const getBase64StringFromByteArray = (
    byteArray: string,
    nome: string
) => {
    const mimeType = getMimeType(nome);
    return `data:${mimeType};base64,${byteArray}`;
};

export const downloadFile = (byteArray: string, documento: Documento) => {
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    FileSaver.saveAs(base64File, documento.nome!);
};

export const downloadMultipleFiles = (documenti: Documento[]) => {
    documenti.forEach((el) => {
        const extension = getFileExtension(el.codiceBucket!);
        FileSaver.saveAs(el.base64String!, el.nome! + "." + extension);
    });
};

export const openFile = async (byteArray: string, documento: Documento) => {
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    const blob = await getBlobFromBase64String(base64File);
    const url = URL.createObjectURL(blob);
    window.open(url);
};

export const checkShareability = (presentAlert: any) => {
    if (!navigator.canShare) {
        errorHandler(
            null,
            () => {},
            "Questo Browser non permette la condivisione di file.",
            presentAlert
        );
        return false;
    }
    return true;
};

const checkSpecificFileShareability = (presentAlert: any, file: File) => {
    if (!navigator.canShare({ files: [file] })) {
        errorHandler(
            null,
            () => {},
            `${file.name} non può essere condiviso.`,
            presentAlert
        );
        return false;
    }
    return true;
};

const getFilesFromBase64Strings = async (listBase64Strings: Documento[]) => {
    const filesToShare: File[] = [];
    for (let i = 0; i < listBase64Strings.length; i++) {
        const file = await getFileObjectFromBase64String(
            listBase64Strings[i],
            i.toString()
        );
        filesToShare.push(file);
    }
    return filesToShare;
};

export const shareMultipleFiles = async (
    documenti: Documento[],
    presentAlert: any
) => {
    if (!checkShareability(presentAlert)) return;
    const files = await getFilesFromBase64Strings(documenti);

    try {
        if (isNativeApp) {
            /* return Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
            })
                .then(() => {
                    return Filesystem.getUri({
                        directory: Directory.Cache,
                        path: fileName,
                    });
                })
                .then((uriResult) => {
                    return Share.share({
                        title: fileName,
                        text: fileName,
                        url: uriResult.uri,
                    });
                }); */
        } else {
            await navigator.share({
                files,
            });
        }
    } catch (error) {
        errorHandler(
            null,
            () => {},
            `Condivisione non riuscita.`,
            presentAlert
        );
    }
};

export const getFileObjectFromBase64String = async (
    documento: Documento,
    index: string
) => {
    const extension = getFileExtension(documento.codiceBucket!);
    const blob = await getBlobFromBase64String(documento.base64String!);
    const file = getFileFromBlob(blob, index, extension!);
    return file;
};

export const shareFile = async (
    byteArray: string,
    documento: Documento,
    presentAlert: any
) => {
    if (!checkShareability(presentAlert)) return;
    const base64File = getBase64StringFromByteArray(byteArray, documento.nome!);
    const blob = await getBlobFromBase64String(base64File);
    const file = new File([blob], documento.nome!, { type: blob.type });
    if (!checkSpecificFileShareability(presentAlert, file)) return;
    try {
        await navigator.share({
            files: [file],
        });
    } catch (error) {
        errorHandler(
            null,
            () => {},
            `Condivisione non riuscita.`,
            presentAlert
        );
    }
};

export const getFileNameWithoutExtension = (nome: string) => {
    const parti = nome.split(".");
    if (parti.length > 1) parti.pop();
    const output = parti.join(".").split("-").join(" ");
    return capitalize(output);
};

export const getFileExtension = (nome: string) => nome.split(".").pop();

const updateFileName = (oldName: string, newName: string) => {
    const extension = getFileExtension(oldName);
    return `${newName}.${extension}`;
};

const getFileNames = (listFiles: File[]) => {
    let output = "";
    Array.from(listFiles).forEach((el) => (output = output + `'${el.name}' `));
    return output;
};

export const submitFile = async (
    e: any,
    setShowLoading: Dispatch<SetStateAction<boolean>> | null,
    presentAlert: any,
    url: string,
    setUpdate: Dispatch<SetStateAction<number>>,
    tipologia?: "documento" | "foto",
    currentFileSpeciale?: fileSpeciale | null
) => {
    if (e.target.files.length === 0) return;
    setShowLoading!(true);
    await uploadFileToServer(
        setUpdate,
        setShowLoading!,
        e.target.files,
        0,
        presentAlert,
        url,
        tipologia,
        currentFileSpeciale
    );
};

const concludiUpload = (
    setUpdate: Dispatch<SetStateAction<number>>,
    listFiles: File[],
    setShowLoading: Dispatch<SetStateAction<boolean>>,
    presentAlert: any,
    currentFileSpeciale?: fileSpeciale | null
) => {
    setShowLoading(false);
    presentAlert({
        header: "Ottimo",
        subHeader: ` File ${
            currentFileSpeciale
                ? updateFileName(listFiles[0].name, currentFileSpeciale)
                : getFileNames(listFiles)
        } aggiunt${listFiles.length === 1 ? "o" : "i"} con successo`,
        buttons: [
            {
                text: "OK",
                handler: () =>
                    setTimeout(
                        () => setUpdate((prevState) => ++prevState),
                        1000
                    ),
            },
        ],
    });
};

const uploadFileToServer = async (
    setUpdate: Dispatch<SetStateAction<number>>,
    setShowLoading: Dispatch<SetStateAction<boolean>>,
    listFiles: File[],
    currentIndex: number,
    presentAlert: any,
    url: string,
    tipologia?: "documento" | "foto",
    currentFileSpeciale?: fileSpeciale | null
) => {
    if (currentIndex === listFiles.length) {
        concludiUpload(
            setUpdate,
            listFiles,
            setShowLoading,
            presentAlert,
            currentFileSpeciale
        );
        return;
    }
    let file: File | null = listFiles[currentIndex];
    if (currentFileSpeciale) {
        var blob = file!.slice(0, file!.size, file!.type);
        file = new File(
            [blob],
            updateFileName(file!.name, currentFileSpeciale),
            { type: file!.type }
        );
    }
    if (file!.type === "image/heic") {
        file = await convertHeichToJpeg(file!, presentAlert);
        if (!file) return;
    }
    const formData = new FormData();
    formData.append("file", file!);
    if (tipologia) formData.append("name", tipologia);
    try {
        await axiosInstance.post(url, formData);
        ++currentIndex;
        uploadFileToServer(
            setUpdate,
            setShowLoading,
            listFiles,
            currentIndex,
            presentAlert,
            url,
            tipologia,
            currentFileSpeciale
        );
    } catch (e) {
        setShowLoading(false);
        errorHandler(
            e,
            () => setTimeout(() => setUpdate((prevState) => ++prevState), 1000),
            `Procedura interrotta: caricamento di '${file.name}' non riuscito`,
            presentAlert
        );
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

const convertStringsToTimes = (input: Documento[]) =>
    input.map((el) => new Date(el.nome!.split("_")[0]).getTime());

export const sortReports = (reports: Documento[]) => {
    reports.sort((a, b) => {
        // estrai prima string e convertila in tempo
        const [primoTempo, secondoTempo] = convertStringsToTimes([a, b]);
        return primoTempo - secondoTempo;
    });
};

export const getFileSpeciale = (files: Documento[], input: fileSpeciale) =>
    files.filter((el: Documento) => el.nome?.includes(input));

export const isFileSpecialePresent = (
    files: Documento[],
    input: fileSpeciale
) => getFileSpeciale(files, input).length > 0;

export const getFilesNonSpeciali = (
    files: Documento[],
    type: "immobile" | "persona"
) => {
    // per ogni file presente
    return files.filter((filePresente: Documento) => {
        // per ogni file speciale
        return listFileSpeciali
            .filter((el) => el.type === type)
            .map((el) => el.fileSpeciale)
            .every((fileSpeciale) => {
                // se il presente include lo speciale togli
                return !filePresente.nome?.includes(fileSpeciale);
            });
    });
};
