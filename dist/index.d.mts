import { RequestHandler } from 'express';

declare const config: (options: {
    baseUrl: string;
    serviceName: string;
}) => {
    authenticateKey: (...scopes: string[]) => RequestHandler;
};

export { config };
