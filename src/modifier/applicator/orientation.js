'use strict';

class Orientation extends require('./abstract-applicator') {
    async apply(image, info, values) {
        const orientation = values.getOptional('Orientation');

        if (null === orientation) {
            return image;
        }

        return 'auto' === orientation ? image.rotate() : image.rotate(parseInt(orientation));
    }
}

module.exports = Orientation;
