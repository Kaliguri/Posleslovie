import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { RequestIdInterceptor } from "./common/interceptors/request-id.interceptor";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new RequestIdInterceptor());

  const port = Number.parseInt(process.env.PORT ?? "4000", 10);
  await app.listen(port);
}

void bootstrap();
