import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './winston-logger.service';

@Global()
@Module({
	providers: [AppLoggerService],
	exports: [AppLoggerService]
})
export class LoggerModule {}
