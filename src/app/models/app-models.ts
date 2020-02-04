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
    dateOfBirth: Date;
    dateOfDeath: Date;
    photoUrl: string;
}

export class ParsedPersonality {
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

export class Article {
    constructor() {}
    id: string;
    title: string;
    content: string;
    dateStart:Date;
    dateEnd:Date;
    mainPersonality: Personality;
    secondaryPersonality: Personality;
    tertiaryPersonality: Personality;
    otherPersonalities: Personality[];
    mainTopic: Topic;
    secondaryTopic: Topic;
    tertiaryTopic: Topic;
    otherTopics: Topic[];
    mainCountry: Country;
    secondaryCountry: Country;
    tertiaryCountry: Country;
    otherCountries: Country[];
    sourceName: string;
    sourceUrl: string;
    mainImage: string;
    secondaryImage: string;
    tertiaryImage: string;
    otherImages: string[];
}