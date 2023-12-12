import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // TODO: add url to cors for prod
  await app.listen(3000);
}
bootstrap();
