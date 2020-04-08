'use strict';

exports.lambdaHandler = async event => {
    const { services, container } = require('./bootstrap');

    return container.get(services.Application.type).run(event);
};
