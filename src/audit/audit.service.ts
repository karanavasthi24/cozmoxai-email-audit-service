/**
 * AuditService
 *
 * Responsible for orchestrating the email audit process.
 * Runs all rules on a parsed email, aggregates results, and generates a structured report.
 */
import { Injectable } from '@nestjs/common';
import { RulesService } from '../rules/rules.service';
import { IParsedEmail } from '../email/interfaces/parsed-email.interface';
import { IAuditReport } from './interfaces/audit-report.interface';
import { AppLoggerService } from '../utils/logger/winston-logger.service';

@Injectable()
export class AuditService {
	constructor(
		private readonly rulesService: RulesService,
		private readonly logger: AppLoggerService
	) {}

	/**
	 * Runs all audit rules on the provided email and returns a structured report.
	 * @param email The parsed email to audit
	 * @returns IAuditReport containing results, score, and summary
	 */
	generateReport(email: IParsedEmail): IAuditReport {
		const { results, totalScore } = this.rulesService.auditEmail({
			subject: email.subject,
			text: email.text!,
			html: email.html
		});

		const summary = this.generateSummary(results);

		const report: IAuditReport = {
			emailSubject: email.subject,
			from: email.from,
			to: email.to,
			score: totalScore,
			results,
			summary
		};

		this.logger.log(`Audit report generated for: ${email.subject}`);
		return report;
	}

	/**
	 * Generates a human-readable summary of the audit results.
	 * @param results Array of rule results
	 * @returns Summary string (e.g., "Passed 4 of 5 rules. 1 rule(s) need improvement.")
	 */
	private generateSummary(results: any[]): string {
		const passed = results.filter(r => r.passed).length;
		const failed = results.length - passed;
		return `Passed ${passed} of ${results.length} rules. ${failed} rule(s) need improvement.`;
	}
}
