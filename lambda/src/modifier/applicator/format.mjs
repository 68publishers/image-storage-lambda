import sharp from 'sharp'
import { AbstractApplicator } from './abstract-applicator.mjs';
import { SupportedType } from '../../helper/supported-type.mjs';

export class Format extends AbstractApplicator {
    async apply(image, info, values) {
        const quality = values.getOptional('Quality', parseInt(this._config.ENCODE_QUALITY));
        const { extension, pages } = await this.#getFileExtensionAndNumberOfPages(image, info);

        if (!(['gif', 'webp'].includes(extension)) && 1 < pages) {
            image = await image.toBuffer().then(data => sharp(data, { animated: false, pages: 1 }));
        }

        if (['jpg', 'jpeg', 'pjpg'].includes(extension)) {
            image = image.flatten({
                background: { r: 255, g: 255, b: 255 },
            });
        }

        if ('pjpg' === extension) {
            return image.jpeg({
                quality: quality,
                progressive: true,
            });
        }

        return image.toFormat(extension, {
            quality: quality,
        });
    }

    async #getFileExtensionAndNumberOfPages(image, info) {
        let extension = info.extension;
        const metadata = await image.metadata();

        if (null !== extension && SupportedType.isExtensionSupported(extension)) {
            return {
                extension: extension,
                pages: metadata.pages,
            };
        }

        return {
            extension: SupportedType.isExtensionSupported(metadata.format) ? metadata.format : SupportedType.getDefaultExtension(),
            pages: metadata.pages,
        };
    }
}
