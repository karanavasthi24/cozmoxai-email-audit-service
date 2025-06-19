import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLoggerService } from './utils/logger/winston-logger.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly logger: AppLoggerService
	) {}

	@Get()
	getHello(): string {
		this.logger.log('hello there');
		return this.appService.getHello();
	}
	@Get('error')
	throwError() {
		throw new Error('Something broke!');
	}
}
