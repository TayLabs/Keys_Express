"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateKey;
const AppError_1 = __importDefault(require("../types/AppError"));
const HttpStatus_enum_1 = __importDefault(require("../types/HttpStatus.enum"));
function authenticateKey(...scopes) {
    return async (req, res, next) => {
        try {
            // Validate api key via api call
            const response = await fetch(`http://localhost:7212/api/v1/services/${'auth'}/keys/verify`, {
                method: 'POST',
                body: JSON.stringify({
                    key: '',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new AppError_1.default('Failed to validate api keys service', HttpStatus_enum_1.default.NOT_FOUND);
            }
            next();
        }
        catch (error) {
            console.error(error);
        }
    };
}
