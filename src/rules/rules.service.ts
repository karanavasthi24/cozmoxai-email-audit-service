import { Injectable } from '@nestjs/common';
import { RuleRunnerService } from './engine/rule-runner.service';
import { IRuleResult } from './interfaces/audit-rule.interface';

@Injectable()
export class RulesService {
	constructor(private readonly ruleRunner: RuleRunnerService) {}

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
