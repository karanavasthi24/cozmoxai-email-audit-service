/**
 * RuleRunnerService
 *
 * This service manages and executes all email audit rules.
 */
import { Injectable } from '@nestjs/common';
import { IAuditRule, IRuleResult } from '../interfaces/audit-rule.interface';
import { GreetingRule } from '../rules/greeting-rule';

@Injectable()
export class RuleRunnerService {
	/**
	 * Array of all registered audit rules. Add new rules here.
	 */
	private readonly rules: IAuditRule[] = [];

	/**
	 * Registers all rule classes to be used for email evaluation.
	 * Add new rules to the rules array for automatic inclusion.
	 */
	constructor() {
		// Register rules here
		this.rules.push(new GreetingRule());
	}

	/**
	 * Evaluates all registered rules against the provided email.
	 * @param email The email object to audit (subject, text, html)
	 * @returns Array of rule evaluation results (IRuleResult[])
	 */
	evaluateEmail(email: {
		subject: string;
		text: string;
		html?: string;
	}): IRuleResult[] {
		return this.rules.map(rule => rule.evaluate(email));
	}
}
