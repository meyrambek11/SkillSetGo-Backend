import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/transform.interceptor';
import { config } from 'aws-sdk';

async function bootstap(): Promise<void> {
  try {
    const PORT = process.env.PORT || 8000;
    config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.setGlobalPrefix('skill-set-go');

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    console.log()

    await app.listen(PORT, () =>
      console.log(`Server started on port = ${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
}

void bootstap();
