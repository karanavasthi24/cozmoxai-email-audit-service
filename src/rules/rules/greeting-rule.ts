import { IAuditRule, IRuleResult } from '../interfaces/audit-rule.interface';

export class GreetingRule implements IAuditRule {
	getName(): string {
		return 'GreetingRule';
	}

	evaluate(email: { subject: string; text: string }): IRuleResult {
		const hasGreeting = /^(hi|hello|dear|hey)\b/i.test(email.text.trim());
		return {
			ruleName: this.getName(),
			passed: hasGreeting,
			score: hasGreeting ? 10 : 0,
			justification: hasGreeting
				? 'Greeting is present in the message.'
				: 'No greeting found at the beginning of the message.'
		};
	}
}
