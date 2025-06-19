import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './utils/logger/logger.module';
import { EmailModule } from './email/email.module';
import { RulesModule } from './rules/rules.module';
import { AuditModule } from './audit/audit.module';

@Module({
	imports: [LoggerModule, EmailModule, RulesModule, AuditModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
