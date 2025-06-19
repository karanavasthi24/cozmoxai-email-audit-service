import { Injectable } from '@nestjs/common';
import { IAuditRule, IRuleResult } from '../interfaces/audit-rule.interface';
import { GreetingRule } from '../rules/greeting-rule';
// import more rules here...

@Injectable()
export class RuleRunnerService {
	private readonly rules: IAuditRule[] = [];

	constructor() {
		// Register rules here
		this.rules.push(new GreetingRule());
		// Add more as needed
	}

	evaluateEmail(email: {
		subject: string;
		text: string;
		html?: string;
	}): IRuleResult[] {
		return this.rules.map(rule => rule.evaluate(email));
	}
}
