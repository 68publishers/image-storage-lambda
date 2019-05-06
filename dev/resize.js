'use strict';

((Lambda, Avgr, Fs, Path, Url) => {

    if (!Avgr.hasOwnProperty('_') || 1 !== Avgr._.length) {
        throw 'Invalid arguments passed into CLI. Valid format is "node lambda/dev/run.js DOCUMENT_PATH"';
    }

    const   envConfig = Path.join(__dirname, './../config/env-config'),
            awsConfig = Path.join(__dirname, './../config/aws-config');

    if (!Fs.existsSync(envConfig)) {
        throw 'Missing configuration file /config/env-config, please define this file.';
    }

    if (!Fs.existsSync(awsConfig)) {
        throw 'Missing configuration file /config/aws-config, please define this file.';
    }

    let key = Avgr._[0];

    try {
        key = new Url(key);
        key = key.pathname;
    } catch (e) {
        if (-1 !== key.indexOf('?')) {
            key = key.substring(0, key.indexOf('?'));
        }
    }

    key = key.replace(/^\/+/, '');

    Lambda.execute({
        lambdaPath: Path.join(__dirname, '/../index.js'),
        envfile: envConfig,
        profilePath: awsConfig,
        timeoutMs: 15000,
        event: {
            queryStringParameters: {
                key: key
            }
        }
    });

})(require('lambda-local'), require('minimist')(process.argv.slice(2)), require('fs'), require('path'), require('url').URL);
