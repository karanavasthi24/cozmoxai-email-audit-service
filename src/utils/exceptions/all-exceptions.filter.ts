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

		this.logger.error(
			`Exception thrown at ${request.method} ${request.url}`,
			isHttp ? exception.stack : (exception as any)?.stack
		);

		response.status(status).json(errorResponse);
	}
}
