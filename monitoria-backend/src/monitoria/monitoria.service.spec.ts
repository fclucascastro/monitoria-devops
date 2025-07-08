import { Test, TestingModule } from '@nestjs/testing';
import { MonitoriaService } from './monitoria.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('MonitoriaService', () => {
  let service: MonitoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MonitoriaService],
    }).compile();

    service = module.get<MonitoriaService>(MonitoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
