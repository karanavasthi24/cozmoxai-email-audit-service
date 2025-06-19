import { AppLoggerService } from '../utils/logger/winston-logger.service';
import { EmailService } from './email.service';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';

jest.mock('fs');
jest.mock('mailparser', () => ({
	simpleParser: jest.fn()
}));

jest.mock('../utils/logger/winston-logger.service', () => ({
	AppLoggerService: jest.fn().mockImplementation(() => ({
		log: jest.fn(),
		error: jest.fn()
	}))
}));

describe('EmailService', () => {
	let service: EmailService;
	let logger: AppLoggerService;

	beforeEach(() => {
		logger = new AppLoggerService();
		service = new EmailService(logger);
		jest.clearAllMocks();
	});

	it('should parse a valid .eml file', async () => {
		(fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mocked'));
		(simpleParser as jest.Mock).mockResolvedValue({
			subject: 'Test Subject',
			from: { text: 'sender@example.com' },
			to: { value: [{ address: 'receiver@example.com' }] },
			date: new Date(),
			text: 'Hello',
			html: '<p>Hello</p>',
			attachments: [
				{
					filename: 'image.png',
					contentType: 'image/png',
					size: 123,
					content: Buffer.from('img')
				}
			]
		});

		const parsed = await service.parseEmlFile('mocked/path.eml');
		expect(parsed.subject).toBe('Test Subject');
		expect(parsed.from).toBe('sender@example.com');
		expect(parsed.to.length).toBeGreaterThan(0);
		expect(parsed.attachments.length).toBeGreaterThan(0);
	});

	it('should throw for invalid file', async () => {
		(fs.readFileSync as jest.Mock).mockImplementation(() => {
			throw new Error('fail');
		});
		await expect(
			service.parseEmlFile('invalid/path.eml')
		).rejects.toThrow();
	});
});
