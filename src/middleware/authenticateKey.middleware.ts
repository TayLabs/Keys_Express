import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import type { RequestHandler } from 'express';

export default function authenticateKey(...scopes: string[]): RequestHandler {
  return async (req, res, next) => {
    try {
      // Validate api key via api call
      const response = await fetch(
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

      if (!response.ok) {
        throw new AppError(
          'Failed to validate api keys service',
          HttpStatus.NOT_FOUND
        );
      }

      next();
    } catch (error) {
      console.error(error);
    }
  };
}
