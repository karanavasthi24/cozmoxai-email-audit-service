/**
 * IAuditReport
 *
 * Represents the structured result of an email audit operation.
 * Used to return audit results, scores, and summary to API consumers.
 */
import { IRuleResult } from '../../rules/interfaces/audit-rule.interface';

export interface IAuditReport {
	emailSubject: string;
	from: string;
	to: string[];
	score: number;
	results: IRuleResult[];
	/** Human-readable summary of the audit */
	summary: string;
}
