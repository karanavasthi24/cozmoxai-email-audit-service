import { AuditController } from './audit.controller';
import { AppLoggerService } from '../utils/logger/winston-logger.service';

jest.mock('../utils/logger/winston-logger.service', () => ({
	AppLoggerService: jest.fn().mockImplementation(() => ({
		log: jest.fn(),
		error: jest.fn()
	}))
}));

const mockEmailService = {
	parseEmlFile: jest.fn()
};
const mockAuditService = {
	generateReport: jest.fn()
};
const mockLogger = new (AppLoggerService as any)();

describe('AuditController', () => {
	let controller: AuditController;

	beforeEach(() => {
		jest.clearAllMocks();
		controller = new AuditController(
			mockLogger,
			mockEmailService as any,
			mockAuditService as any
		);
	});

	it('should return audit report on success', async () => {
		const file = { path: 'some/path/file.eml' } as any;
		const parsedEmail = { subject: 'Test' };
		const report = { emailSubject: 'Test', score: 100 };
		mockEmailService.parseEmlFile.mockResolvedValue(parsedEmail);
		mockAuditService.generateReport.mockReturnValue(report);

		const result = await controller.uploadAndAudit(file);
		expect(result).toEqual({ status: true, data: report });
		expect(mockEmailService.parseEmlFile).toHaveBeenCalledWith(
			'some/path/file.eml'
		);
		expect(mockAuditService.generateReport).toHaveBeenCalledWith(
			parsedEmail
		);
	});

	it('should return error if no file is uploaded', async () => {
		const result = await controller.uploadAndAudit(undefined as any);
		expect(result.status).toBe(false);
		expect(result.reason).toBe('No file uploaded');
	});

	it('should return error if email parsing fails', async () => {
		const file = { path: 'bad/path/file.eml' } as any;
		mockEmailService.parseEmlFile.mockRejectedValue(
			new Error('parse error')
		);
		const result = await controller.uploadAndAudit(file);
		expect(result.status).toBe(false);
		expect(result.reason).toBe('parse error');
		expect(mockLogger.error).toHaveBeenCalledWith(
			'Audit failed',
			expect.anything()
		);
	});
});
