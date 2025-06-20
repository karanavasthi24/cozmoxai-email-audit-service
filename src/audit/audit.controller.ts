/**
 * AuditController
 *
 * Exposes REST API endpoints for uploading and auditing emails.
 * Handles file uploads, invokes email parsing and audit services, and returns structured results.
 */
import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from '../email/email.service';
import { AuditService } from './audit.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppLoggerService } from '../utils/logger/winston-logger.service';

@Controller('audit')
export class AuditController {
	/**
	 * Constructs the AuditController with required services.
	 * @param logger Logger for logging and errors
	 * @param emailService Service for parsing .eml files
	 * @param auditService Service for running audit rules and generating reports
	 */
	constructor(
		private readonly logger: AppLoggerService,
		private readonly emailService: EmailService,
		private readonly auditService: AuditService
	) {}

	/**
	 * Handles file upload and triggers the audit process.
	 * Expects a multipart/form-data request with the key 'file' containing a .eml file.
	 * @param file The uploaded email file
	 * @returns Structured audit report or error response
	 */
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
				}
			}),
			fileFilter: (req, file, cb) => {
				if (
					file.mimetype !== 'message/rfc822' &&
					!file.originalname.endsWith('.eml')
				) {
					return cb(
						new BadRequestException('Only .eml files are allowed'),
						false
					);
				}
				cb(null, true);
			}
		})
	)
	async uploadAndAudit(@UploadedFile() file: Express.Multer.File) {
		try {
			if (!file) {
				throw new BadRequestException('No file uploaded');
			}

			const parsedEmail = await this.emailService.parseEmlFile(file.path);
			const report = this.auditService.generateReport(parsedEmail);

			return {
				status: true,
				data: report
			};
		} catch (error) {
			this.logger.error('Audit failed', error.stack);

			return {
				status: false,
				reason:
					error?.message ||
					'Something went wrong while processing the email'
			};
		}
	}
}
