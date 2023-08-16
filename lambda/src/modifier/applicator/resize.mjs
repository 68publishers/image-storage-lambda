import { AbstractApplicator } from './abstract-applicator.mjs';
import { Fit } from '../fit.mjs';
import { InvalidStateError } from '../../error/invalid-state-error.mjs';

export class Resize extends AbstractApplicator {
    async apply(image, info, values) {
        const pd = parseFloat(values.getOptional('PixelDensity', 1));
        const aspectRatio = values.getOptional('AspectRatio');
        const fit = values.getOptional('Fit', 'crop-center');

        let width = values.getOptional('Width');
        let height = values.getOptional('Height');

        if (null !== aspectRatio && ((null === width && null === height) || (null !== width && null !== height))) {
            throw new InvalidStateError(`The only one dimension (width or height) must be defined if an aspect ratio is used. Passed values: w=${null !== width ? width : 'null'}, h=${null !== height ? height : 'null'}, ar=${Object.values(aspectRatio).join('x')}`);
        }

        if (null === width && null === height && 1.0 === pd) {
            return image;
        }

        let [imageWidth, imageHeight, pageHeight, pages] = await image.metadata().then(metadata => {
            return [metadata.width, metadata.height, metadata.pageHeight, metadata.pages || 1];
        });

        imageHeight = pageHeight || (imageHeight / pages);

        if (null === width && null === height) {
            width = imageWidth;
            height = imageHeight;
        } else if (null === width) {
            width = height * ((null !== aspectRatio ? aspectRatio.w : imageWidth) / (null !== aspectRatio ? aspectRatio.h : imageHeight));
        } else if (null === height) {
            height = width / ((null !== aspectRatio ? aspectRatio.w : imageWidth) / (null !== aspectRatio ? aspectRatio.h : imageHeight));
        }

        width = parseInt(null !== width ? width * pd : width);
        height = parseInt(null !== height ? height * pd : height);

        return image.resize(width, height, Fit.resolveSharpOptions(fit));
    }
}
