import type { RequestHandler } from 'express';

export default function authenticateKey(...scopes: string[]): RequestHandler {
  return async (req, res, next) => {
    try {
      // Validate api key via api call
      await fetch(
        `http://localhost:7212/api/v1/services/${'auth'}/keys/verify`,
        {
          method: 'POST',
          body: JSON.stringify({
            key: '',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      next();
    } catch (error) {
      console.error(error);
    }
  };
}
