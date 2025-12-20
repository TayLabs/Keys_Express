import axios from 'axios';

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
  INTERNAL_SERVER_ERROR: 500
};
var HttpStatus_enum_default = HttpStatus;
var config = (options) => {
  return {
    authenticateKey: (...scopes) => async (req, _res, next) => {
      try {
        const apiKey = req.headers["x-api-key"];
        const response = await axios.post(
          `${options.baseUrl}/api/v1/services/${options.serviceName}/keys/verify`,
          {
            key: apiKey,
            scopes
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (!response.data.success) {
          throw new AppError(
            response.data.message,
            response.status
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (process.env.NODE_ENV === "development")
            console.error("Keys API Error:", {
              code: error.code,
              message: error.message,
              data: error.response?.data
            });
          throw new AppError(
            error.message,
            error.status || HttpStatus_enum_default.INTERNAL_SERVER_ERROR
          );
        } else {
          throw new AppError(
            "Internal server error",
            HttpStatus_enum_default.INTERNAL_SERVER_ERROR
          );
        }
      }
    }
  };
};

export { config };
