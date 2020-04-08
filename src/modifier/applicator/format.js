'use strict';

const SupportedType = require('../../helper/supported-type');

class Format extends require('./abstract-applicator') {
    async apply(image, info, values) {
        const quality = values.getOptional('Quality', parseInt(this._config.ENCODE_QUALITY));

        return this._getFileExtension(image, info).then(extension => {
            if ('pjpg' === extension) {
                return image.jpeg({
                    quality: quality,
                    progressive: true
                });
            }

            return image.toFormat(extension, {
                quality: quality
            });
        });
    }

    async _getFileExtension(image, info) {
        let extension = info.extension;

        if (null !== extension && SupportedType.isExtensionSupported(extension)) {
            return extension;
        }

        return image.metadata().then((metadata) => {
            return SupportedType.isExtensionSupported(metadata.format) ? metadata.format : SupportedType.getDefaultExtension();
        });
    }
}

module.exports = Format;
