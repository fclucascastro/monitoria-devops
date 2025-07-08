import { Test, TestingModule } from '@nestjs/testing';
import { MonitoriaController } from './monitoria.controller';
import { MonitoriaService } from './monitoria.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('MonitoriaController', () => {
  let controller: MonitoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [MonitoriaController],
      providers: [MonitoriaService],
    }).compile();

    controller = module.get<MonitoriaController>(MonitoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
