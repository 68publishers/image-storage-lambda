'use strict';

const   Property = require('./modules/Property'),
        ModifierFactory = require('./modules/ModifierFactory'),
        Service = require('./modules/Service'),
        NoImageResolver = require('./modules/NoImageResolver'),
        Sharp = require('sharp');

const service = new Service(process);
const noImageResolver = new NoImageResolver(service.URL, 'noimage', 'noapp.png');
const factory = new ModifierFactory(() => {
    return {
        h: new Property(properties => properties.w.getValue() === null),
        pd: new Property(false, '1', service.ALLOWED_PIXEL_DENSITY),
        pf: new Property(false, '0', new Set(['0', '1'])),
        w: new Property(properties => properties.h.getValue() === null)
    }
}, service.URL);

noImageResolver.add('noimage', 'nouser.png', (modifier) => {
    return modifier.getPath().includes('userAvatar/');
});

factory.addValidator(properties => {
    if (service.ALLOWED_RESOLUTIONS.size > 0 && !service.ALLOWED_RESOLUTIONS.has(`${properties.w.getValue()}x${properties.h.getValue()}`)) {
        throw 'Unallowed resolution';
    }
});

module.exports = {
    getService: () => service,
    getModifierFactory: () => factory,
    getNoImageResolver: () => noImageResolver,
    getSharp: () => Sharp
};
