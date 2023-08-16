import { AbstractApplicator } from './abstract-applicator.mjs';

export class Orientation extends AbstractApplicator {
    async apply(image, info, values) {
        const orientation = values.getOptional('Orientation');

        if (null === orientation) {
            return image;
        }

        return 'auto' === orientation ? image.rotate() : image.rotate(parseInt(orientation));
    }
}
