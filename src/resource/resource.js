'use strict';

class Resource {
    constructor(image, imageInfo, modifierFacade) {
        this._image = image;
        this._imageInfo = imageInfo;
        this._modifierFacade = modifierFacade;
    }

    get info() {
        return this._imageInfo;
    }

    get image() {
        return this._image;
    }

    async modifyImage(modifier) {
        return this._image = await this._modifierFacade.modifyImage(this.image, this.info, modifier);
    }
}

module.exports = Resource;
