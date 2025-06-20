/**
 * GreetingRule
 *
 * Checks if the email body starts with a proper greeting (e.g., Hi, Hello, Dear, Hey).
 */
import { IAuditRule, IRuleResult } from '../interfaces/audit-rule.interface';
import { RULES_CONFIG, RuleKey } from './rule-config';

export class GreetingRule implements IAuditRule {
	private readonly ruleKey: RuleKey;

	constructor(ruleKey: RuleKey = 'greeting') {
		this.ruleKey = ruleKey;
	}

	getName(): string {
		return RULES_CONFIG[this.ruleKey].name;
	}

	/**
	 * Evaluates if the email text starts with a greeting.
	 * @param email The email object to check
	 * @returns IRuleResult with pass/fail, score, and justification
	 */
	evaluate(email: { subject: string; text: string }): IRuleResult {
		const hasGreeting = /^(hi|hello|dear|hey)\b/i.test(email.text.trim());
		const score = RULES_CONFIG[this.ruleKey].score;
		return {
			ruleName: this.getName(),
			passed: hasGreeting,
			score: hasGreeting ? score : 0,
			justification: hasGreeting
				? 'Greeting is present in the message.'
				: 'No greeting found at the beginning of the message.'
		};
	}
}
