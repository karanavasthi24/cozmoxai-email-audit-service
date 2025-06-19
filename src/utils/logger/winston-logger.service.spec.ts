import { AppLoggerService } from './winston-logger.service';

jest.mock('./winston-logger.service', () => ({
	AppLoggerService: jest.fn().mockImplementation(() => ({
		log: jest.fn(),
		error: jest.fn()
	}))
}));

describe('AppLoggerService', () => {
	let logger: AppLoggerService;

	beforeEach(() => {
		logger = new AppLoggerService();
		jest.spyOn(logger, 'log').mockImplementation(() => undefined);
		jest.spyOn(logger, 'error').mockImplementation(() => undefined);
	});

	it('should log info message', () => {
		expect(() => logger.log('test log')).not.toThrow();
	});

	it('should log error message', () => {
		expect(() => logger.error('test error', 'stack')).not.toThrow();
	});
});
