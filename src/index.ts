import { RequestHandler } from 'express';
import AppError from './types/AppError';
import HttpStatus from './types/HttpStatus.enum';
import { ResponseBody } from './types/ResponseBody';
import axios from 'axios';

const config = (options: { baseUrl: string; serviceName: string }) => {
	return {
		authenticateKey:
			(...scopes: string[]): RequestHandler =>
			async (req, _res, next) => {
				try {
					const apiKey = req.headers['x-api-key'];

					const response = await axios.post(
						`${options.baseUrl}/api/v1/services/${options.serviceName}/keys/verify`,
						{
							key: apiKey,
							scopes,
						},
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);

					if (!response.data.success) {
						throw new AppError(
							response.data.message,
							response.status as (typeof HttpStatus)[keyof typeof HttpStatus]
						);
					}
				} catch (error) {
					if (axios.isAxiosError(error)) {
						if (process.env.NODE_ENV === 'development')
							console.error('Keys API Error:', {
								code: error.code,
								message: error.message,
								data: error.response?.data,
							});

						throw new AppError(
							error.message,
							(error.status as (typeof HttpStatus)[keyof typeof HttpStatus]) ||
								HttpStatus.INTERNAL_SERVER_ERROR
						);
					} else {
						throw new AppError(
							'Internal server error',
							HttpStatus.INTERNAL_SERVER_ERROR
						);
					}
				}
			},
	};
};

export { config };
