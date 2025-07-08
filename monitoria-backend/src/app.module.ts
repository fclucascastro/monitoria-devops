import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitoriaModule } from './monitoria/monitoria.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [MonitoriaModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
