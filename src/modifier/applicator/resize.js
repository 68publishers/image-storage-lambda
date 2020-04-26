'use strict';

const Fit = require('../fit');
const InvalidStateError = require('../../error/invalid-state-error');

class Resize extends require('./abstract-applicator') {
    async apply(image, info, values) {
        const pd = parseFloat(values.getOptional('PixelDensity', 1));
        const aspectRatio = values.getOptional('AspectRatio');
        const fit = values.getOptional('Fit', 'crop-center');

        let width = values.getOptional('Width');
        let height = values.getOptional('Height');
        let imageWidth, imageHeight;

        if (null !== aspectRatio && ((null === width && null === height) || (null !== width && null !== height))) {
            throw new InvalidStateError(`The only one dimension (width or height) must be defined if an aspect ratio is used. Passed values: w=${null !== width ? width : 'null'}, h=${null !== height ? height : 'null'}, ar=${Object.values(aspectRatio).join('x')}`);
        }

        if (null === width && null === height && 1.0 === pd) {
            return image;
        }

        [imageWidth, imageHeight] = await image.metadata().then(metadata => {
            return [metadata.width, metadata.height];
        });

        if (null === width && null === height) {
            width = imageWidth;
            height = imageHeight;
        } else if (null === width) {
            width = height * ((null !== aspectRatio.w ? aspectRatio.w : imageWidth) / (null !== aspectRatio.h ? aspectRatio.h : imageHeight));
        } else if (null === height) {
            height = width / ((null !== aspectRatio.w ? aspectRatio.w : imageWidth) / (null !== aspectRatio.h ? aspectRatio.h : imageHeight));
        }

        width = parseInt(null !== width ? width * pd : width);
        height = parseInt(null !== height ? height * pd : height);

        return image.resize(width, height, Fit.resolveSharpOptions(fit));
    }
}

module.exports = Resize;
