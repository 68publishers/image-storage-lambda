import { InvalidArgumentError } from '../../error/invalid-argument-error.mjs';
import { Original } from '../original.mjs';
import { Height } from '../height.mjs';
import { Width } from '../width.mjs';
import { AspectRatio } from '../aspect-ratio.mjs';
import { Fit } from '../fit.mjs';
import { PixelDensity } from '../pixel-density.mjs';
import { Orientation } from '../orientation.mjs';
import { Quality } from '../quality.mjs';
import { Orientation as OrientationApplicator } from '../applicator/orientation.mjs';
import { Resize as ResizeApplicator } from '../applicator/resize.mjs';
import { Format as FormatApplicator } from '../applicator/format.mjs';
import { AllowedResolutionValidator } from '../validator/allowed-resolution-validator.mjs';
import { AllowedPixelDensityValidator } from '../validator/allowed-pixel-density-validator.mjs';
import { AllowedQualityValidator } from '../validator/allowed-quality-validator.mjs';

export class ModifierFacade {
    #modifierCollection;
    #codec;
    #applicators;
    #validators;

    constructor({ modifierCollection, codec }) {
        this.#modifierCollection = modifierCollection;
        this.#codec = codec;
        this.#applicators = [];
        this.#validators = [];
    }

    static createDefault({ modifierCollection, codec, config }) {
        const facade = new ModifierFacade({
            modifierCollection,
            codec,
        });

        facade.setModifiers([
            new Original(),
            new Height(),
            new Width(),
            new AspectRatio(),
            new Fit(),
            new PixelDensity(),
            new Orientation(),
            new Quality(),
        ]);

        facade.setApplicators([
            new OrientationApplicator(config),
            new ResizeApplicator(config),
            new FormatApplicator(config),
        ]);

        facade.setValidators([
            new AllowedResolutionValidator(config),
            new AllowedPixelDensityValidator(config),
            new AllowedQualityValidator(config),
        ]);

        return facade;
    }

    setModifiers(modifiers) {
        for (let i in modifiers) {
            this.#modifierCollection.add(modifiers[i]);
        }
    }

    setApplicators(applicators) {
        for (let i in applicators) {
            this.#applicators.push(applicators[i]);
        }
    }

    setValidators(validators) {
        for (let i in validators) {
            this.#validators.push(validators[i]);
        }
    }

    async modifyImage(image, imageInfo, modifier) {
        if (!Object.keys(modifier).length) {
            throw new InvalidArgumentError('Can not modify image, modifiers are empty.');
        }

        const values = this.#modifierCollection.parseValues(modifier);

        for (let i in this.#validators) {
            this.#validators[i].validate(values);
        }

        for (let i in this.#applicators) {
            image = await this.#applicators[i].apply(image, imageInfo, values);
        }

        return image;
    }

    get codec() {
        return this.#codec;
    }
}
