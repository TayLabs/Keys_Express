import { RequestHandler } from 'express';

declare const config: (options: {
    baseUrl: string;
    serviceName: string;
    apiKeyHeader?: string | "x-api-key";
}) => {
    authenticateKey: (...scopes: string[]) => RequestHandler;
};

export { config };
