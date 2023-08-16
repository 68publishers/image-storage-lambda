export class Resource {
    #image;
    #imageInfo;
    #modifierFacade;

    constructor(image, imageInfo, modifierFacade) {
        this.#image = image;
        this.#imageInfo = imageInfo;
        this.#modifierFacade = modifierFacade;
    }

    get info() {
        return this.#imageInfo;
    }

    get image() {
        return this.#image;
    }

    async modifyImage(modifier) {
        return this.#image = await this.#modifierFacade.modifyImage(this.image, this.info, modifier);
    }
}
