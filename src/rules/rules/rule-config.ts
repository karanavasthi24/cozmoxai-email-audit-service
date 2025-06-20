/* eslint-disable @typescript-eslint/naming-convention */
// Centralized configuration for all audit rules
// Add new rules here as they are implemented

export const RULES_CONFIG = {
	greeting: {
		name: 'GreetingRule',
		score: 10
	}
};

export type RuleKey = keyof typeof RULES_CONFIG;
