import { Injectable, BadRequestException } from '@nestjs/common';
import { simpleParser } from 'mailparser';
import * as fs from 'fs';
import { AppLoggerService } from '../utils/logger/winston-logger.service';
import { IParsedEmail } from './interfaces/parsed-email.interface';

@Injectable()
export class EmailService {
	constructor(private readonly logger: AppLoggerService) {}

	async parseEmlFile(filePath: string): Promise<IParsedEmail> {
		try {
			const raw = fs.readFileSync(filePath);
			const parsed = await simpleParser(raw);

			if (!parsed.attachments || parsed.attachments.length === 0) {
				throw new BadRequestException('No attachments found in email.');
			}

			const imageAttachments = parsed.attachments.filter(att =>
				att.contentType.startsWith('image/')
			);

			if (imageAttachments.length === 0) {
				throw new BadRequestException(
					'Email must contain at least one image attachment.'
				);
			}

			const parsedEmail: IParsedEmail = {
				subject: parsed.subject || '',
				from: parsed.from?.text || '',
				to: parsed.to?.value.map(v => v.address) || [],
				date: parsed.date || new Date(),
				text: parsed.text || '',
				html: parsed.html || '',
				attachments: imageAttachments.map(att => ({
					filename: att.filename || '',
					contentType: att.contentType,
					size: att.size,
					content: att.content
				}))
			};

			this.logger.log(
				`Parsed email successfully from ${parsedEmail.from}`
			);
			return parsedEmail;
		} catch (error) {
			this.logger.error(
				`Failed to parse email: ${error.message}`,
				error.stack
			);
			throw new BadRequestException('Failed to parse .eml file');
		}
	}
}
