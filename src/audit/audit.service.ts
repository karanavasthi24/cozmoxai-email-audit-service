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

	private generateSummary(results): string {
		const passed = results.filter(r => r.passed).length;
		const failed = results.length - passed;
		return `Passed ${passed} of ${results.length} rules. ${failed} rule(s) need improvement.`;
	}
}
