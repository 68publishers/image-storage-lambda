'use strict';

const di = require('inversify');
const services = require('./services');

require('reflect-metadata');

// Make all services are injectable
for (let name in services) {
    di.decorate(di.injectable(), services[name].class);
}

// Create Container
const container = new di.Container();

// Resolve dependencies and bind it to the Container
let service, injects;

for (let name in services) {
    service = services[name];
    injects = service.injects || [];

    for (let injectIndex in injects) {
        if (!injects.hasOwnProperty(injectIndex)) {
            continue;
        }

        di.decorate(di.inject(injects[injectIndex]), service.class, parseInt(injectIndex));
    }

    if ('factory' in service && 'function' === typeof service.factory) {
        container.bind(service.type).toDynamicValue(service.factory).inSingletonScope();
    } else {
        container.bind(service.type).to(service.class).inSingletonScope();
    }
}

module.exports = {
    services,
    container
};
