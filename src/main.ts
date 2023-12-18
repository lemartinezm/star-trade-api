import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Star Trade API')
    .setDescription(
      'Star Trade API is an open source API for digital banking made to practice.',
    )
    .setVersion('0.0.1')
    .addTag('star-trade')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(); // TODO: add url to cors for prod
  await app.listen(3000);
}
bootstrap();
