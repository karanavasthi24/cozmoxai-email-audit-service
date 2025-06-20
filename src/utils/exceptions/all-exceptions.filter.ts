/**
 * Global exception filter for handling all uncaught exceptions in the application.
 *
 * This filter catches all exceptions thrown by controllers or middleware,
 * logs them using the application's logger, and returns a standardized error response.
 */
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logger/winston-logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: AppLoggerService) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const isHttp = exception instanceof HttpException;
		const status = isHttp
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const message = isHttp ? exception.message : 'Internal server error';

		const errorResponse = {
			status: false,
			reason: message
		};

		// Log error details and stack trace for auditing
		this.logger.error(
			`Exception thrown at ${request.method} ${request.url}`,
			isHttp ? exception.stack : (exception as any)?.stack
		);

		// Send standardized error response
		response.status(status).json(errorResponse);
	}
}
