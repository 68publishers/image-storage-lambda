'use strict';

const InvalidArgumentError = require('../../error/invalid-argument-error');

class ModifierFacade {
    constructor(modifierCollection, codec) {
        this._modifierCollection = modifierCollection;
        this._codec = codec;

        this._applicators = [];
        this._validators = [];
    }

    setModifiers(modifiers) {
        for (let i in modifiers) {
            if (!modifiers.hasOwnProperty(i)) {
                continue;
            }

            this._modifierCollection.add(modifiers[i]);
        }
    }

    setApplicators(applicators) {
        for (let i in applicators) {
            if (!applicators.hasOwnProperty(i)) {
                continue;
            }

            this._applicators.push(applicators[i]);
        }
    }

    setValidators(validators) {
        for (let i in validators) {
            if (!validators.hasOwnProperty(i)) {
                continue;
            }

            this._validators.push(validators[i]);
        }
    }

    async modifyImage(image, imageInfo, modifier) {
        if (!Object.keys(modifier).length) {
            throw new InvalidArgumentError('Can not modify image, modifiers are empty.');
        }

        const values = this._modifierCollection.parseValues(modifier);

        for (let i in this._validators) {
            if (!this._validators.hasOwnProperty(i)) {
                continue;
            }

            this._validators[i].validate(values);
        }

        for (let i in this._applicators) {
            if (!this._applicators.hasOwnProperty(i)) {
                continue;
            }

            image = await this._applicators[i].apply(image, imageInfo, values);
        }

        return image;
    }

    get codec() {
        return this._codec;
    }
}

module.exports = ModifierFacade;
