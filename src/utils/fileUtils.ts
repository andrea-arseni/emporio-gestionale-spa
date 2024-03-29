import FileSaver from "file-saver";
import { Dispatch, SetStateAction } from "react";
import { Documento } from "../entities/documento.model";
import axiosInstance from "./axiosInstance";
import heic2any from "heic2any";
import Resizer from "react-image-file-resizer";
import { fileSpeciale, listFileSpeciali } from "../types/file_speciali";
import { getDayName, getTwoDigitString } from "./timeUtils";
import { isNativeApp } from "./contactUtils";
import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";
import { SocialSharingOptions } from "../types/social-sharing-options";
import { File as FilePlugin } from "@awesome-cordova-plugins/file";
import { FileOpener } from "@awesome-cordova-plugins/file-opener";
import { isPlatform } from "@ionic/core";
import { changeLoading } from "../store/ui-slice";
import { addFile } from "../store/immobile-slice";
import { Mediastore } from "@agorapulse/capacitor-mediastore";
import { capitalize } from "./stringUtils";
import {
    NOT_SHAREABLE_MSG,
    checkSpecificFileShareability,
    isSharingAvailable,
} from "./shareUtils";

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

const getImageName = (nome: string) => {
    const extension = getFileExtension(nome);
    const today = new Date();
    return `${today.getFullYear()}${getTwoDigitString(
        today.getMonth()
    )}${getTwoDigitString(today.getHours())}_${Math.floor(
        100000 + Math.random() * 900000
    )}.${extension}`;
};

export const salvaFotoInIos = async (documenti: Documento[], dispatch: any) => {
    try {
        await SocialSharing.saveToPhotoAlbum(
            documenti.map((el) => el.base64String!)
        );
        if (dispatch) dispatch(changeLoading(false));
        alert(
            `Foto salvat${
                documenti.length === 1 ? "a" : "e"
            } con successo in Galleria`
        );
    } catch (e: any) {
        if (dispatch) dispatch(changeLoading(false));
        alert("Errore nel salvataggio delle foto, procedura annullata.");
    }
};

export const salvaDocumentoInIos = async (documento: Documento, blob: Blob) => {
    const isImage = getFileType(documento.nome!) === "image";
    if (isImage) {
        await salvaFotoInIos([documento], null);
    } else {
        try {
            await FilePlugin.writeFile(
                FilePlugin.cacheDirectory,
                documento.nome!,
                blob,
                { replace: true }
            );
        } catch (e) {
            alert("File non salvabile, impossibile procedere");
        }
        try {
            await FileOpener.showOpenWithDialog(
                `${FilePlugin.cacheDirectory}${documento.nome!}`,
                getMimeType(documento.nome!)
            );
            setTimeout(async () => {
                await FilePlugin.removeFile(
                    FilePlugin.cacheDirectory,
                    documento.nome!
                );
            }, 120000);
        } catch (e) {
            alert("File non apribile, impossibile procedere");
        }
    }
};

export const salvaDocumentoInAndroid = async (nome: string, blob: Blob) => {
    // 1. salvi il file nella cache directory
    try {
        await FilePlugin.writeFile(FilePlugin.cacheDirectory, nome, blob, {
            replace: true,
        });
    } catch (e) {
        alert("File non salvabile, impossibile procedere");
    }

    // 2. definisci se è una immagine oppure un file generico
    const isImage = getFileType(nome) === "image";

    // 3. salvi in galleria o download
    if (isImage) {
        try {
            Mediastore.savePicture({
                album: "Emporio Case",
                filename: nome,
                path: `${FilePlugin.cacheDirectory}${nome}`,
            });
            alert(`File scaricato. Si trova in Galleria`);
        } catch (e) {
            alert("Errore nel salvataggio in Galleria, impossibile procedere");
        }
    } else {
        try {
            Mediastore.saveToDownloads({
                filename: nome,
                path: `${FilePlugin.cacheDirectory}${nome}`,
            });
            alert(`File scaricato. Si trova in Downloads`);
        } catch (e) {
            alert("Errore nel salvataggio in Download, impossibile procedere");
        }
    }

    // 4. elimini il file in cache
    setTimeout(async () => {
        await FilePlugin.removeFile(FilePlugin.cacheDirectory, nome);
    }, 120000);
};

export const downloadFile = async (documento: Documento) => {
    const blob = await getBlobFromBase64String(documento.base64String!);
    if (isNativeApp && isPlatform("ios")) {
        salvaDocumentoInIos(documento, blob);
    } else if (isNativeApp && isPlatform("android")) {
        await salvaDocumentoInAndroid(documento.nome!, blob);
    } else {
        FileSaver.saveAs(documento.base64String!, documento.nome!);
    }
};

export const downloadMultipleFiles = async (
    documenti: Documento[],
    dispatch: any,
    immobileId: string,
    errorHandler: any,
    photoType: `SIGNED` | `ORIGINAL`
) => {
    if (isNativeApp) dispatch(changeLoading(true));
    if (isNativeApp && isPlatform("android")) {
        let error = null;

        for (let i = 0; i < documenti.length; i++) {
            const usedName = await getImageName(documenti[i].codiceBucket!);

            let base64File = documenti[i].base64String!;

            if (photoType === "ORIGINAL") {
                try {
                    const res = await axiosInstance.get(
                        `/immobili/${immobileId}/files/${documenti[i].id}?photoType=${photoType}`
                    );
                    if (!res || !res.data || !res.data.byteArray)
                        throw new Error("Lettura non riuscita");

                    base64File = getBase64StringFromByteArray(
                        res.data.byteArray,
                        documenti[i].nome!
                    );
                } catch (e) {
                    error = `'${usedName}' originale non disponibile, procedura interrotta`;
                    break;
                }
            }

            const blob = await getBlobFromBase64String(base64File);
            // 1. scrivi il file nella cache
            try {
                await FilePlugin.writeFile(
                    FilePlugin.cacheDirectory,
                    usedName,
                    blob,
                    {
                        replace: true,
                    }
                );
            } catch (e) {
                error = `'${usedName}' non salvabile, procedura interrotta`;
                break;
            }

            // 2. salvi in galleria o download
            try {
                Mediastore.savePicture({
                    album: "Emporio Case",
                    filename: usedName,
                    path: `${FilePlugin.cacheDirectory}${usedName}`,
                });
            } catch (e) {
                error = `'${usedName}' non salvato in Galleria, procedura interrotta`;
                break;
            }

            // 3. elimini il file in cache
            setTimeout(async () => {
                await FilePlugin.removeFile(
                    FilePlugin.cacheDirectory,
                    usedName
                );
            }, 120000);
        }
        dispatch(changeLoading(false));
        alert(
            error
                ? error
                : `Foto salvat${
                      documenti.length === 1 ? "a" : "e"
                  } con successo in Galleria`
        );
    } else if (isNativeApp && isPlatform("ios")) {
        try {
            let listBase64Strings = documenti.map((el) => el.base64String!);

            let error = null;

            if (photoType === "ORIGINAL") {
                listBase64Strings = [];
                for (let i = 0; i < documenti.length; i++) {
                    const usedName = await getImageName(
                        documenti[i].codiceBucket!
                    );

                    try {
                        const res = await axiosInstance.get(
                            `/immobili/${immobileId}/files/${documenti[i].id}?photoType=${photoType}`
                        );
                        if (!res || !res.data || !res.data.byteArray)
                            throw new Error("Lettura non riuscita");

                        listBase64Strings.push(
                            getBase64StringFromByteArray(
                                res.data.byteArray,
                                documenti[i].nome!
                            )
                        );
                    } catch (e) {
                        error = `'${usedName}' originale non disponibile, procedura interrotta`;
                        break;
                    }
                }
            }

            await SocialSharing.saveToPhotoAlbum(listBase64Strings);
            dispatch(changeLoading(false));
            alert(
                error
                    ? error
                    : `Foto salvat${
                          documenti.length === 1 ? "a" : "e"
                      } con successo in Galleria`
            );
        } catch (e: any) {
            dispatch(changeLoading(false));
            alert("Errore nel salvataggio delle foto, procedura annullata.");
        }
    } else {
        if (documenti.length === 1) {
            try {
                let base64File = documenti[0].base64String!;
                if (photoType === "ORIGINAL") {
                    const res = await axiosInstance.get(
                        `/immobili/${immobileId}/files/${documenti[0].id}?photoType=${photoType}`
                    );
                    if (!res || !res.data || !res.data.byteArray)
                        throw new Error("Lettura non riuscita");

                    base64File = getBase64StringFromByteArray(
                        res.data.byteArray,
                        documenti[0].nome!
                    );
                }
                FileSaver.saveAs(base64File, documenti[0].nome! + ".jpg");
            } catch (e) {
                errorHandler(e, "Salvataggio foto non riuscita");
                return null;
            }
        } else {
            try {
                const reqBody = documenti.map((el) => el.id);
                const res = await axiosInstance.post(
                    `/immobili/${immobileId}/files/zip?photoType=${photoType}`,
                    reqBody
                );
                FileSaver.saveAs(
                    `data:application/zip;base64,${res.data.byteArray}`,
                    `Lista foto`
                );
            } catch (e) {
                errorHandler(e, "Salvataggio delle foto non riuscito");
                return null;
            }
        }
    }
};

export const openFile = async (documento: Documento) => {
    const blob = await getBlobFromBase64String(documento.base64String!);
    const url = URL.createObjectURL(blob);
    if (isNativeApp) {
        try {
            await FilePlugin.writeFile(
                FilePlugin.cacheDirectory,
                documento.nome!,
                blob,
                { replace: true }
            );
        } catch (e) {
            alert("File non scaricabile, impossibile procedere");
        }
        try {
            await FileOpener.open(
                `${FilePlugin.cacheDirectory}${documento.nome!}`,
                getMimeType(documento.nome!)
            );
            setTimeout(async () => {
                await FilePlugin.removeFile(
                    FilePlugin.cacheDirectory,
                    documento.nome!
                );
            }, 20000);
        } catch (e) {
            alert("File non apribile, procedura annullata");
        }
    } else {
        window.open(url);
    }
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
    errorHandler: any
) => {
    if (!isSharingAvailable()) {
        errorHandler(null, NOT_SHAREABLE_MSG);
        return;
    }

    const files = await getFilesFromBase64Strings(documenti);
    try {
        if (isNativeApp) {
            const options: SocialSharingOptions = {
                files: documenti.map((el) => el.base64String!),
            };

            await SocialSharing.shareWithOptions(options);
        } else {
            await navigator.share({
                files,
            });
        }
    } catch (error) {
        errorHandler(null, `Condivisione non riuscita.`);
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

export const shareFile = async (documento: Documento, errorHandler: any) => {
    if (!isSharingAvailable()) {
        //setIsError(true);
        errorHandler(null, NOT_SHAREABLE_MSG);
        return;
    }
    const blob = await getBlobFromBase64String(documento.base64String!);
    const file = new File([blob], documento.nome!, { type: blob.type });
    if (!checkSpecificFileShareability(errorHandler, file)) return;
    try {
        if (isNativeApp) {
            const options: SocialSharingOptions = {
                files: [documento.base64String!],
            };
            await SocialSharing.shareWithOptions(options);
        } else {
            await navigator.share({
                files: [file],
            });
        }
    } catch (error) {
        errorHandler(null, `Condivisione non riuscita.`);
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
    errorHandler: any,
    url: string,
    setUpdate: Dispatch<SetStateAction<number>>,
    tipologia?: "documento" | "foto",
    currentFileSpeciale?: fileSpeciale | null,
    dispatch?: any
) => {
    if (e.target.files.length === 0) return;
    if (e.target.files.length > 1 && currentFileSpeciale) {
        presentAlert({
            header: "Attenzione!",
            subHeader: `Per i file speciali puoi selezionare un file soltanto`,
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
            ],
        });
        return;
    }
    setShowLoading!(true);
    await uploadFileToServer(
        setUpdate,
        setShowLoading!,
        e.target.files,
        0,
        presentAlert,
        errorHandler,
        url,
        tipologia,
        currentFileSpeciale,
        dispatch
    );
};

const concludiUpload = (
    setUpdate: Dispatch<SetStateAction<number>>,
    listFiles: File[],
    setShowLoading: Dispatch<SetStateAction<boolean>>,
    presentAlert: any,
    currentFileSpeciale?: fileSpeciale | null,
    dispatch?: any
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
                    dispatch === undefined
                        ? setTimeout(
                              () => setUpdate((prevState) => ++prevState),
                              1000
                          )
                        : {},
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
    errorHandler: any,
    url: string,
    tipologia?: "documento" | "foto",
    currentFileSpeciale?: fileSpeciale | null,
    dispatch?: any
) => {
    if (currentIndex === listFiles.length) {
        concludiUpload(
            setUpdate,
            listFiles,
            setShowLoading,
            presentAlert,
            currentFileSpeciale,
            dispatch
        );
        return;
    }
    let file: File | null = listFiles[currentIndex];
    if (file!.type === "image/heic") {
        file = await convertHeichToJpeg(file!, errorHandler, setShowLoading);
        if (!file) return;
    }
    const formData = new FormData();
    formData.append("file", file!);
    if (tipologia) formData.append("tipologia", tipologia);
    if (currentFileSpeciale)
        formData.append(
            "name",
            updateFileName(listFiles[0].name, currentFileSpeciale)
        );
    try {
        const res = await axiosInstance.post(url, formData);
        const newFoto = res.data;
        if (dispatch !== undefined)
            setTimeout(() => {
                dispatch(addFile(newFoto));
            }, 3000);
        ++currentIndex;
        uploadFileToServer(
            setUpdate,
            setShowLoading,
            listFiles,
            currentIndex,
            presentAlert,
            errorHandler,
            url,
            tipologia,
            currentFileSpeciale,
            dispatch
        );
    } catch (e) {
        setShowLoading(false);
        errorHandler(
            e,
            `Procedura interrotta: caricamento di '${file.name}' non riuscito`
        );
    }
};

const convertHeichToJpeg = async (
    file: File,
    errorHandler: any,
    setShowLoading: any
) => {
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
        setShowLoading(false);
        errorHandler(
            e,
            "Non è riuscita la conversione dell'immagine HEIC fornita"
        );
        return null;
    }
};

const convertFileToBlob = async (file: File) =>
    new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

export const getFileFromBlob = (blob: Blob, name: string, extension: string) =>
    new File([blob], getFileNameWithoutExtension(name) + "." + extension);

export const getBlobFromBase64String = async (base64String: string) =>
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
