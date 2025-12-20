'use strict';

// src/types/AppError.ts
var AppError = class _AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};

// src/types/HttpStatus.enum.ts
var HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
var HttpStatus_enum_default = HttpStatus;

// src/index.ts
var config = (options) => {
  return {
    authenticateKey: (...scopes) => async (req, _res, next) => {
      try {
        const apiKey = req.headers["x-api-key"];
        const response = await fetch(
          `${options.baseUrl}/api/v1/services/${options.serviceName}/keys/verify`,
          {
            method: "POST",
            body: JSON.stringify({
              key: apiKey,
              scopes
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (!response.ok) {
          throw new AppError(
            "Failed to validate api keys service",
            HttpStatus_enum_default.NOT_FOUND
          );
        }
        const body = await response.json();
        if (!body.success) {
          throw new AppError(
            body.message,
            response.status
          );
        } else {
          next();
        }
      } catch (error) {
        next(
          new AppError(
            "Internal error validating api key",
            HttpStatus_enum_default.INTERNAL_SERVER_ERROR
          )
        );
      }
    }
  };
};

exports.config = config;
