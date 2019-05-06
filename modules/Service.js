'use strict';

const   AWS = require('aws-sdk');

class Service {
    constructor (process) {
        this.process = process;
        this.S3 = new AWS.S3({
            signatureVersion: 'v4'
        });
        this.BUCKET = this.getEnv('BUCKET', '');
        this.URL = this.getEnv('URL', '');
        this.ALLOWED_RESOLUTIONS = this.getEnvSet('ALLOWED_RESOLUTIONS');
        this.ALLOWED_PIXEL_DENSITY = this.getEnvSet('ALLOWED_PIXEL_DENSITY');
    }
    getEnv (name, defaultValue) {
        return name in this.process.env
            ? this.process.env[name]
            : defaultValue;
    }
    getEnvSet (name) {
        return new Set(this.getEnv(name, '').split(/\s*,\s*/));
    }
    getObject (key, callback = null) {
        const args = {Bucket: this.BUCKET, Key: key};

        return typeof callback === 'function'
            ? this.S3.getObject(args, callback)
            : this.S3.getObject(args);
    }
    putObject (obj = {}) {
        obj['Bucket'] = this.BUCKET;

        return this.S3.putObject(obj);
    };
}

module.exports = Service;
