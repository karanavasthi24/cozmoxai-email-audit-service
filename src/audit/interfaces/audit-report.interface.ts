import { IRuleResult } from '../../rules/interfaces/audit-rule.interface';

export interface IAuditReport {
	emailSubject: string;
	from: string;
	to: string[];
	score: number;
	results: IRuleResult[];
	summary: string;
}
