import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from '@common/modules/config';
import { LoggerService } from '@common/modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useLogger(app.get(LoggerService));

  const options = new DocumentBuilder()
    .setTitle('YOCCO Swagger')
    .setDescription('The YOCCO API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(app.get(AppConfigService).port);
}
bootstrap();
