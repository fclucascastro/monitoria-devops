import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 Isso torna o PrismaService "visível" para outros módulos
})
export class PrismaModule {}
