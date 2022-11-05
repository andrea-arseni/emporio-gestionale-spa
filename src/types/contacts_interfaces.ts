export interface PermissionStatus {
    granted: boolean;
}

export interface Contact {
    contactId: string;
    displayName?: string;
    phoneNumbers: PhoneNumber[];
    emails: EmailAddress[];
    photoThumbnail?: string;
    organizationName?: string;
    organizationRole?: string;
    birthday?: string;
}

export interface PhoneNumber {
    label?: string;
    number?: string;
}

export interface EmailAddress {
    label?: string;
    address?: string;
}
