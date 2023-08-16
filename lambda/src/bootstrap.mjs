import { S3Client } from '@aws-sdk/client-s3';

import { Config } from './config/config.mjs';

import { ModifierCollection } from './modifier/collection/modifier-collection.mjs';
import { Codec } from './modifier/codec/codec.mjs';
import { ModifierFacade } from './modifier/facade/modifier-facade.mjs';

import { RequestFactory } from './http/request-factory.mjs';
import { ResponseFactory } from './http/response-factory.mjs';
import { DefaultSignatureStrategy } from './security/default-signature-strategy.mjs';

import { ResourceFactory } from './resource/resource-factory.mjs';
import { NoImageResolver } from './no-image/no-image-resolver.mjs';

import { ImageServer } from './image-server/image-server.mjs';
import { Application } from './application/application.mjs';

const s3 = new S3Client();

const config = new Config();

const modifierCollection = new ModifierCollection();

const codec = new Codec({
    config,
    modifierCollection,
});

const modifierFacade = ModifierFacade.createDefault({
    modifierCollection,
    codec,
    config,
});

const requestFactory = new RequestFactory();

const responseFactory = new ResponseFactory();

const signatureStrategy = new DefaultSignatureStrategy({
    config,
});

const resourceFactory = new ResourceFactory({
    s3,
    config,
    modifierFacade,
});

const noImageResolver = new NoImageResolver({
    config,
});

const imageServer = new ImageServer({
    s3,
    config,
    modifierFacade,
    resourceFactory,
    responseFactory,
    signatureStrategy,
    noImageResolver,
});

export const application = new Application({
    requestFactory,
    responseFactory,
    imageServer,
});
