import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleRunnerService } from './engine/rule-runner.service';

@Module({
	providers: [RulesService, RuleRunnerService],
	exports: [RulesService]
})
export class RulesModule {}
