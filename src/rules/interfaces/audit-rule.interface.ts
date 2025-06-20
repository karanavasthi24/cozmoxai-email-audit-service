/**
 * Interfaces for defining audit rules and their results in the email audit system.
 *
 * IRuleResult: The result of a single rule evaluation.
 * IAuditRule: Contract for all rule classes (must implement getName and evaluate).
 */

/**
 * Represents the result of evaluating a single audit rule.
 */
export interface IRuleResult {
	ruleName: string;
	passed: boolean;
	score: number;
	/** Human-readable justification for the result */
	justification: string;
}

/**
 * Contract for all audit rule classes.
 */
export interface IAuditRule {
	getName(): string;
	/**
	 * Evaluates the rule against the provided email.
	 * @param email The email object to audit (subject, text, html)
	 * @returns IRuleResult for this rule
	 */
	evaluate(email: {
		subject: string;
		text: string;
		html?: string;
	}): IRuleResult;
}
