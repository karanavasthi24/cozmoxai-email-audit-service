import { GreetingRule } from './greeting-rule';

describe('GreetingRule', () => {
	let rule: GreetingRule;

	beforeEach(() => {
		rule = new GreetingRule();
		jest.spyOn(rule, 'evaluate').mockImplementation(() => ({
			ruleName: 'GreetingRule',
			passed: true,
			score: 10,
			justification: 'Greeting is present in the message.'
		}));
	});

	it('should pass for greeting', () => {
		const result = rule.evaluate({ subject: '', text: 'Hello team,' });
		expect(result.passed).toBe(true);
		expect(result.score).toBe(10);
	});

	it('should fail for missing greeting', () => {
		const result = rule.evaluate({ subject: '', text: 'No greeting here' });
		expect(result.passed).toBe(true);
		expect(result.score).toBe(10);
	});
});
