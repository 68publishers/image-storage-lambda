import { application } from './src/bootstrap.mjs';

export const lambdaHandler = async event => {
    return await application.run(event);
};
