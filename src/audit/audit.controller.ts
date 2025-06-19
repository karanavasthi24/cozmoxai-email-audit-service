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
	constructor(
		private readonly logger: AppLoggerService,
		private readonly emailService: EmailService,
		private readonly auditService: AuditService
	) {}

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
