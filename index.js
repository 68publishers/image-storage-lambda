'use strict';

exports.handler = (event, context, callback) => {
    try {
        const container = require('./bootstrap');

        let contentType = 'image/jpeg';
        const   Service = container.getService(),
                Factory = container.getModifierFactory(),
                Sharp = container.getSharp(),
                NoImage = container.getNoImageResolver();

        const   key = event.queryStringParameters.key,
                modifier = Factory.create(key),
                toInt = (n) => new Int32Array([n])[0],
                getFormat = (format) => {
                    format = 'string' === typeof format && format.startsWith('image/') ? format.replace('image/', '') : 'jpeg';

                    if ([ 'svg', 'gif' ].includes(format)) {
                        return 'png';
                    }

                    return [ 'jpeg', 'png', 'webp', 'tiff' ].includes(format) ? format : 'jpeg';
                },
                pd = toInt(modifier.getProperties().pd.getValue()),
                w = toInt(modifier.getProperties().w.getValue()) * pd,
                h = toInt(modifier.getProperties().h.getValue()) * pd,
                pf = toInt(modifier.getProperties().pf.getValue()) === 1 || NoImage.isNoImage(modifier);

        const   x307 = path => {
            callback(null, {
                statusCode: '307',
                headers: {
                    'location': path
                },
                body: ''
            })
        };

        Service.getObject(modifier.getOriginalPath())
            .promise()
            .then(data => {
                if (true === pf && data.hasOwnProperty('ContentType') && typeof data.ContentType === 'string') {
                    contentType = data.ContentType;
                }

                return Sharp(data.Body)
                    .resize(w, h)
                    .toFormat(getFormat(contentType), {
                        quality: 100
                    })
                    .toBuffer()
            })
            .then(buffer => Service.putObject({
                Body: buffer,
                ContentType: contentType,
                Key: modifier.getPath()
            }).promise())
            .then(() => {
                x307(modifier.getUrl())
            })
            .catch(() => {
                x307(NoImage.getNoImageUrl(modifier))
            })
    } catch (e) {
        callback(null, {
            statusCode: '403',
            headers: {},
            body: e
        });
    }
};
