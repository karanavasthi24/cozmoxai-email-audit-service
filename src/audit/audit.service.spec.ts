import { AuditService } from './audit.service';
import { AppLoggerService } from '../utils/logger/winston-logger.service';
import { IParsedEmail } from '../email/interfaces/parsed-email.interface';
import { RulesService } from '../rules/rules.service';

jest.mock('../rules/rules.service');
jest.mock('../utils/logger/winston-logger.service', () => ({
	AppLoggerService: jest.fn().mockImplementation(() => ({
		log: jest.fn(),
		error: jest.fn()
	}))
}));

describe('AuditService', () => {
	let auditService: AuditService;
	let rulesService: jest.Mocked<RulesService>;
	let logger: jest.Mocked<AppLoggerService>;

	beforeEach(() => {
		rulesService = new RulesService({} as any) as any;
		(rulesService.auditEmail as jest.Mock).mockReturnValue({
			results: [],
			totalScore: 0
		});
		logger = new AppLoggerService() as any;
		auditService = new AuditService(rulesService, logger);
	});

	it('should return report', () => {
		const parsedEmail: IParsedEmail = {
			subject: 'Subject',
			from: 'sender@example.com',
			to: ['receiver@example.com'],
			date: new Date(),
			text: 'Hello there',
			html: '<p>Hello</p>',
			attachments: []
		};

		const report = auditService.generateReport(parsedEmail);
		expect(report.emailSubject).toBe(parsedEmail.subject);
		expect(report.score).toBe(0);
		expect(report.results).toEqual([]);
	});
});
