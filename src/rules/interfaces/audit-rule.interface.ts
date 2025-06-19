export interface IRuleResult {
	ruleName: string;
	passed: boolean;
	score: number;
	justification: string;
}

export interface IAuditRule {
	getName(): string;
	evaluate(email: {
		subject: string;
		text: string;
		html?: string;
	}): IRuleResult;
}
