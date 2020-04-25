'use strict';

const services = {};

const S3 = require('aws-sdk/clients/s3');
const Codec = require('./modifier/codec/codec');
const ModifierFacade = require('./modifier/facade/modifier-facade');
const ModifierCollection = require('./modifier/collection/modifier-collection');

const Request = require('./http/request');

const NoImageResolver = require('./no-image/no-image-resolver');

services.Config = {
    type: Symbol.for('Config'),
    class: require('./config/config')
};

services.S3 = {
    type: Symbol.for('S3'),
    class: S3,
    factory: () => {
        return new S3({
            signatureVersion: 'v4'
        });
    }
};

services.ModifierCollectionFactory = {
    type: Symbol.for('ModifierCollectionFactory'),
    class: ModifierCollection,
    factory: () => {
        return () => {
            return new ModifierCollection();
        }
    }
};

services.CodecFactory = {
    type: Symbol.for('CodecFactory'),
    class: Codec,
    factory: (context) => {
        return (modifierCollection) => {
            return new Codec(context.container.get(services.Config.type), modifierCollection);
        }
    }
};

services.ModifierFacade = {
    type: Symbol.for('ModifierFacade'),
    class: ModifierFacade,
    factory: (context) => {
        const env = context.container.get(services.Config.type);
        const collection = context.container.get(services.ModifierCollectionFactory.type)();
        const codec = context.container.get(services.CodecFactory.type)(collection);

        const service = new ModifierFacade(collection, codec);

        service.setModifiers([
            new (require('./modifier/original'))(),
            new (require('./modifier/height'))(),
            new (require('./modifier/width'))(),
            new (require('./modifier/aspect-ratio'))(),
            new (require('./modifier/pixel-density'))(),
            new (require('./modifier/orientation'))(),
            new (require('./modifier/quality'))(),
        ]);

        service.setApplicators([
            new (require('./modifier/applicator/orientation'))(env),
            new (require('./modifier/applicator/resize'))(env),
            new (require('./modifier/applicator/format'))(env),
        ]);

        service.setValidators([
            new (require('./modifier/validator/allowed-resolution-validator'))(env),
            new (require('./modifier/validator/allowed-pixel-density-validator'))(env),
            new (require('./modifier/validator/allowed-quality-validator'))(env),
        ]);

        return service;
    }
};

services.RequestFactory = {
    type: Symbol.for('RequestFactory'),
    class: Request,
    factory: () => {
        return (event) => {
            return new Request(event.path, event.queryStringParameters || {});
        };
    }
};

services.SignatureStrategy = {
    type: Symbol.for('SignatureStrategy'),
    class: require('./security/default-signature-strategy'),
    injects: [
        services.Config.type,
    ]
};

services.ResponseFactory = {
    type: Symbol.for('ResponseFactory'),
    class: require('./http/response-factory')
};

services.ResourceFactory = {
    type: Symbol.for('ResourceFactory'),
    class: require('./resource/resource-factory'),
    injects: [
        services.S3.type,
        services.Config.type,
        services.ModifierFacade.type,
    ]
};

services.NoImageResolver = {
    type: Symbol.for('NoImageResolver'),
    class: NoImageResolver,
    injects: [
        services.Config.type,
    ]
};

services.ImageServer = {
    type: Symbol.for('ImageServer'),
    class: require('./image-server/image-server'),
    injects: [
        services.S3.type,
        services.Config.type,
        services.ModifierFacade.type,
        services.ResourceFactory.type,
        services.ResponseFactory.type,
        services.SignatureStrategy.type,
        services.NoImageResolver.type,
    ]
};

services.Application = {
    type: Symbol.for('Application'),
    class: require('./application/application'),
    injects: [
        services.RequestFactory.type,
        services.ResponseFactory.type,
        services.ImageServer.type,
    ]
};

module.exports = services;
