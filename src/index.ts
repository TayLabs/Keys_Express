import { RequestHandler } from 'express';
import AppError from './types/AppError';
import HttpStatus from './types/HttpStatus.enum';
import { ResponseBody } from './types/ResponseBody';

const config = (options: { baseUrl: string; serviceName: string }) => {
	return {
		authenticateKey:
			(...scopes: string[]): RequestHandler =>
			async (req, _res, next) => {
				try {
					const apiKey = req.headers['x-api-key'];

					// Validate api key via api call
					const response = await fetch(
						`${options.baseUrl}/api/v1/services/${options.serviceName}/keys/verify`,
						{
							method: 'POST',
							body: JSON.stringify({
								key: apiKey,
								scopes,
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

					const body = (await response.json()) as ResponseBody;

					if (!body.success) {
						throw new AppError(
							body.message,
							response.status as (typeof HttpStatus)[keyof typeof HttpStatus]
						);
					} else {
						// User is authenticated
						next();
					}
				} catch (error) {
					next(
						new AppError(
							'Internal error validating api key',
							HttpStatus.INTERNAL_SERVER_ERROR
						)
					);
				}
			},
	};
};

export { config };
