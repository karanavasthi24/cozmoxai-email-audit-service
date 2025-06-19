import { RulesService } from './rules.service';
import { RuleRunnerService } from './engine/rule-runner.service';

jest.mock('./engine/rule-runner.service');

describe('RulesService', () => {
	let rulesService: RulesService;
	let ruleRunner: jest.Mocked<RuleRunnerService>;

	beforeEach(() => {
		ruleRunner = new RuleRunnerService() as any;
		(ruleRunner.evaluateEmail as jest.Mock).mockReturnValue([
			{ passed: true, score: 1, ruleName: 'Mock', justification: 'ok' }
		]);
		rulesService = new RulesService(ruleRunner);
	});

	it('should return score and results array', () => {
		const result = rulesService.auditEmail({
			subject: 'Test',
			text: 'Hello, how are you?',
			html: '<p>Hello</p>'
		});

		expect(result.results.length).toBeGreaterThan(0);
		expect(typeof result.totalScore).toBe('number');
	});
});
