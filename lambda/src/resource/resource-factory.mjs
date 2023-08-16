import sharp from 'sharp'
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Resource } from './resource.mjs';
import { InvalidStateError } from '../error/invalid-state-error.mjs';
import { FileNotFoundError } from '../error/file-not-found-error.mjs';

export class ResourceFactory {
    #s3;
    #config;
    #modifierFacade;

    constructor({ s3, config, modifierFacade }) {
        this.#s3 = s3;
        this.#config = config;
        this.#modifierFacade = modifierFacade;
    }

    async create(imageInfo) {
        const command = new GetObjectCommand({
            Bucket: this.#config.SOURCE_BUCKET,
            Key: imageInfo.createSourcePath(),
        });

        try {
            const response = await this.#s3.send(command);
            const image = await response.Body.transformToByteArray();

            return new Resource(sharp(image, { animated: true }), imageInfo, this.#modifierFacade);
        } catch (e) {
            if ('NoSuchKey' === e.name) {
                throw new FileNotFoundError(imageInfo.createSourcePath());
            }

            throw new InvalidStateError(e.message);
        }
    }
}
