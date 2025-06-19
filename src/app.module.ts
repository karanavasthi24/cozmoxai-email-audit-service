import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './utils/logger/logger.module';
import { EmailModule } from './email/email.module';

@Module({
	imports: [LoggerModule, EmailModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
