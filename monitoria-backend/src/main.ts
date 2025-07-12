// src/main.ts
//import { NestFactory } from '@nestjs/core'
//import { AppModule } from './app.module'

//async function bootstrap() {
  //const app = await NestFactory.create(AppModule)

  // Adicione esta linha:
  //app.enableCors()

//  await app.listen(3000)
//}
//bootstrap()
// src/main.ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['*'] });

  // Garante que seja sempre string: se PORT for undefined, cai em "3000"
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`🚀 Listening on port ${port}`);
}
bootstrap();
