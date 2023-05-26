import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/transform.interceptor';
async function bootstap(): Promise<void> {
  try {
    const PORT = process.env.PORT || 8000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.setGlobalPrefix('skill-set-go');

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(PORT, () =>
      console.log(`Server started on port = ${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
}

void bootstap();
