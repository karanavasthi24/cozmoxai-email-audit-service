/**
 * RulesService
 *
 * This service acts as a facade for running all audit rules on an email.
 * It delegates rule evaluation to the RuleRunnerService and aggregates results.
 */
import { Injectable } from '@nestjs/common';
import { RuleRunnerService } from './engine/rule-runner.service';
import { IRuleResult } from './interfaces/audit-rule.interface';

@Injectable()
export class RulesService {
	constructor(private readonly ruleRunner: RuleRunnerService) {}

	/**
	 * Runs all registered rules on the provided email and aggregates the results.
	 * @param email The email object to audit (subject, text, html)
	 * @returns An object containing the array of rule results and the total score
	 */
	auditEmail(email: { subject: string; text: string; html?: string }): {
		results: IRuleResult[];
		totalScore: number;
	} {
		const results = this.ruleRunner.evaluateEmail(email);
		const totalScore = results.reduce((acc, r) => acc + r.score, 0);

		return {
			results,
			totalScore
		};
	}
}
