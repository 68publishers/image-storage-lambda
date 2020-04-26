'use strict';

const InvalidArgumentError = require('../error/invalid-argument-error');

class Fit extends require('./abstract-parsable-modifier') {
    constructor(alias = 'f') {
        super(alias);
    }

    static get VALUES() {
        return [
            'fill',
            'stretch',
            'contain',
            'crop-center',
            'crop-left',
            'crop-right',
            'crop-top',
            'crop-top-left',
            'crop-top-right',
            'crop-bottom',
            'crop-bottom-left',
            'crop-bottom-right',
        ];
    }

    static get SHARP_POSITION_MAP() {
        return {
            'crop-center': 'centre',
            'crop-top': 'top',
            'crop-top-right': 'right top',
            'crop-right': 'right',
            'crop-bottom-right': 'right bottom',
            'crop-bottom': 'bottom',
            'crop-bottom-left': 'left bottom',
            'crop-left': 'left',
            'crop-top-left': 'left top'
        };
    }

    static resolveSharpOptions(fit) {
        let options = null;

        switch (fit) {
            case 'contain':
                options = {
                    fit: 'inside'
                };
                break;
            case 'stretch':
                options = {
                    fit: 'fill'
                };
                break;
            case 'fill':
                options = {
                    fit: 'contain',
                    position: 'centre'
                };
                break;
        }

        if (null !== options) {
            return options;
        }

        if (!fit.startsWith('crop-') || !(fit in Fit.SHARP_POSITION_MAP)) {
            throw new InvalidArgumentError(`Value "${fit}" is not valid fit`);
        }

        return {
            fit: 'cover',
            position: Fit.SHARP_POSITION_MAP[fit]
        }
    }

    parseValue(value) {
        if (!Fit.VALUES.includes(value)) {
            throw new InvalidArgumentError(`Value "${value}" is not valid fit`);
        }

        return value;
    }
}

module.exports = Fit;
