import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RulesModule } from '../rules/rules.module';
import { AuditController } from './audit.controller';
import { EmailModule } from '../email/email.module';

@Module({
	imports: [RulesModule, EmailModule],
	providers: [AuditService],
	controllers: [AuditController],
	exports: [AuditService]
})
export class AuditModule {}
