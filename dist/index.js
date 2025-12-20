"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const AppError_1 = __importDefault(require("./types/AppError"));
const HttpStatus_enum_1 = __importDefault(require("./types/HttpStatus.enum"));
const config = (options) => {
    return {
        authenticateKey: (...scopes) => async (_req, _res, next) => {
            try {
                // Validate api key via api call
                const response = await fetch(`${options.baseUrl}/api/v1/services/${options.serviceName}/keys/verify`, {
                    method: 'POST',
                    body: JSON.stringify({
                        key: options.apiKey,
                        scopes,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new AppError_1.default('Failed to validate api keys service', HttpStatus_enum_1.default.NOT_FOUND);
                }
                const body = (await response.json());
                if (!body.success) {
                    throw new AppError_1.default(body.message, response.status);
                }
                else {
                    // User is authenticated
                    next();
                }
            }
            catch (error) {
                next(new AppError_1.default('Internal error validating api key', HttpStatus_enum_1.default.INTERNAL_SERVER_ERROR));
            }
        },
    };
};
exports.config = config;
