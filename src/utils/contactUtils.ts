import { Contact, Contacts, ContactType } from "@capacitor-community/contacts";
import { Persona } from "../entities/persona.model";
import { isPlatform } from "@ionic/react";

const askContactPermission = async (presentAlert: any) => {
    const permissionStatus = await Contacts.getPermissions();
    if (permissionStatus.granted === false) {
        presentAlert({
            header: "Attenzione",
            subHeader: "Impossibile procedere con salvataggio contatti.",
            message: `Per poter leggere e salvare contatti è necessario garantire l'accesso ai contatti del telefono alla App. Procedura annullata`,
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
            ],
        });
    }
    return permissionStatus.granted;
};

const getContactWithSameNameOrNumber = async (persona: Persona) => {
    let personaAlreadyPresent: Contact | null = null;
    const result = await Contacts.getContacts();
    for (const contact of result.contacts) {
        if (contact.displayName?.trim() === persona.nome) return contact;
        for (const phoneNumber of contact.phoneNumbers) {
            if (
                phoneNumber.number?.trim().split(" ").join("") ===
                persona.telefono?.trim()
            ) {
                return contact;
            }
        }
    }
    return personaAlreadyPresent;
};

const isContactAlreadyPresent = async (presentAlert: any, persona: Persona) => {
    const contactAlreadyPresent = await getContactWithSameNameOrNumber(persona);
    if (!contactAlreadyPresent) return false;
    let errorType: "sameName" | "sameNumber" =
        contactAlreadyPresent.displayName?.trim() === persona.nome
            ? "sameName"
            : "sameNumber";
    let subHeader = `In rubrica esiste già un contatto con lo stesso ${
        errorType === "sameName" ? "nome" : "numero"
    }.`;
    let errorMessage =
        errorType === "sameName"
            ? `'${contactAlreadyPresent.displayName}' già presente in rubrica.`
            : `'${contactAlreadyPresent.displayName}' è già presente con il numero indicato.`;
    presentAlert({
        header: "Attenzione",
        subHeader,
        message: `${errorMessage} Procedura annullata`,
        buttons: [
            {
                text: "OK",
                role: "cancel",
            },
        ],
    });
};

const getStringIfRelevant = (name: string) =>
    name !== "-" && name !== "." && name !== "/" ? name : "";

export const saveContact = async (
    presentAlert: any,
    persona: Persona,
    errorHandler: any
) => {
    const isGranted = await askContactPermission(presentAlert);
    if (!isGranted) return;

    const isPersonaAlreadyPresent = await isContactAlreadyPresent(
        presentAlert,
        persona
    );
    if (isPersonaAlreadyPresent !== false) return;
    const [givenName, middleName, familyName] = persona.nome!.split(" ");
    const emails = [];
    if (persona.email) emails.push({ label: "email", address: persona.email });
    const phoneNumbers = [];
    if (persona.telefono)
        phoneNumbers.push({ label: "telefono", number: persona.telefono });
    try {
        Contacts.saveContact({
            contactType: ContactType.Person,
            namePrefix: "",
            givenName: getStringIfRelevant(givenName),
            middleName: getStringIfRelevant(middleName),
            familyName: getStringIfRelevant(familyName),
            nameSuffix: "",
            nickname: "",
            jobTitle: "",
            departmentName: "",
            organizationName: "",
            postalAddresses: undefined,
            emailAddresses: emails,
            urlAddresses: undefined,
            phoneNumbers: phoneNumbers,
            birthday: undefined,
            note: "Contatto da Gestionale Emporio Case",
            socialProfiles: undefined,
            image: undefined,
        });
        if (isPlatform("android")) return;
        presentAlert({
            header: "Ottimo",
            message: `Contatto salvato con successo.`,
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
            ],
        });
    } catch (e) {
        errorHandler(e, "Salvataggio contatto non riuscito");
    }
};

export const isNativeApp =
    (isPlatform("ios") || isPlatform("android")) &&
    !isPlatform("mobileweb") &&
    isPlatform("mobile");
