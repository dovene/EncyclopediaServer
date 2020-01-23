export class Theme {
    id: string;
    name: string;
}

export class Topic {
    id: string;
    name: string;
    imageUrl: string;
}

export class ModalDataModel {
    constructor() {}
    title: string;
    description: string;
    imageUrl: string;
    isOkVisible: boolean;
    isCancelVisible: boolean;
}
