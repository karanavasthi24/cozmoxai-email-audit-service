/**
 * AppLoggerService
 *
 * Logger service Winston.
 *
 * - Logs to both console and daily-rotated log files (info and error levels)
 * - Formats logs with timestamps and log levels
 * - Integrates with NestJS LoggerService interface for dependency injection
 * - Supports log rotation (max size, retention period)
 */
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class AppLoggerService implements LoggerService {
	private readonly logger: winston.Logger;

	constructor() {
		const logFormat = winston.format.combine(
			winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			winston.format.printf(
				({ timestamp, level, message, stack }) =>
					`[${timestamp}] ${level.toUpperCase()}: ${message} ${stack ?? ''}`
			)
		);

		const dailyRotateError = new winston.transports.DailyRotateFile({
			filename: 'logs/error-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			level: 'error',
			zippedArchive: false,
			maxSize: '20m',
			maxFiles: '14d'
		});

		const dailyRotateInfo = new winston.transports.DailyRotateFile({
			filename: 'logs/info-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			level: 'info',
			zippedArchive: false,
			maxSize: '20m',
			maxFiles: '14d'
		});

		this.logger = winston.createLogger({
			level: 'info',
			format: logFormat,
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						logFormat
					)
				}),
				dailyRotateError,
				dailyRotateInfo
			]
		});
	}

	/**
	 * Logs an informational message.
	 * @param message The message to log
	 */
	log(message: string) {
		this.logger.info(message);
	}

	/**
	 * Logs an error message and optional stack trace.
	 * @param message The error message
	 * @param trace Optional stack trace
	 */
	error(message: string, trace = '') {
		this.logger.error(message, { trace });
	}

	warn(message: string) {
		this.logger.warn(message);
	}

	debug(message: string) {
		this.logger.debug(message);
	}

	verbose(message: string) {
		this.logger.verbose(message);
	}
}
