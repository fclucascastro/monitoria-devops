import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitoriaDto } from './dto/create-monitoria.dto';
import { UpdateMonitoriaDto } from './dto/update-monitoria.dto';

@Injectable()
export class MonitoriaService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMonitoriaDto) {
    return this.prisma.monitoria.create({ data });
  }

  findAll() {
    return this.prisma.monitoria.findMany();
  }

  findOne(id: number) {
    return this.prisma.monitoria.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateMonitoriaDto) {
    return this.prisma.monitoria.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.monitoria.delete({ where: { id } });
  }
}

