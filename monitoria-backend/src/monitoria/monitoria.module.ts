import { Module } from '@nestjs/common';
import { MonitoriaService } from './monitoria.service';
import { MonitoriaController } from './monitoria.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
   imports: [PrismaModule],
  controllers: [MonitoriaController],
  providers: [MonitoriaService],
})
export class MonitoriaModule {}
