'use strict';

class Resize extends require('./abstract-applicator') {
    async apply(image, info, values) {
        const pd = parseFloat(values.getOptional('PixelDensity', 1));
        let width = values.getOptional('Width');
        let height = values.getOptional('Height');

        if (null === width && null === height) {
            if (1 === pd) {
                return image;
            }

            [width, height] = await image.metadata().then(metadata => {
                return [metadata.width, metadata.height];
            });
        }

        width = null !== width ? width * pd : width;
        height = null !== height ? height * pd : height;

        return image.resize(width, height, {
            fit: 'cover',
            position: 'centre'
        });
    }
}

module.exports = Resize;
