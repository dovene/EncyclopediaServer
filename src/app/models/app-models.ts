export class Theme {
    id: string;
    name: string;
}

export class Topic {
    id: string;
    name: string;
    imageUrl: string;
}

export class Personality {
    id: string;
    fullName: string;
    dateOfBirth: string;
    dateOfDeath: string;
    photoUrl: string;
}

export class Country {
    id: string;
    name: string;
    imageUrl: string;
}

export class Story {
    id: string;
    title: string;
    content: string;
    dateStart:string;
    dateEnd:string;
}

export class ModalDataModel {
    constructor() {}
    title: string;
    description: string;
    imageUrl: string;
    isOkVisible: boolean;
    isCancelVisible: boolean;
}
