import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/exceptions/all-exceptions.filter';
import { AppLoggerService } from './utils/logger/winston-logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const logger = app.get(AppLoggerService);
	app.useGlobalFilters(new AllExceptionsFilter(logger));

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
