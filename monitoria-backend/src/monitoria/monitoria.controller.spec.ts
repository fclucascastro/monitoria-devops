import { Test, TestingModule } from '@nestjs/testing';
import { MonitoriaController } from './monitoria.controller';
import { MonitoriaService } from './monitoria.service';

describe('MonitoriaController', () => {
  let controller: MonitoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoriaController],
      providers: [MonitoriaService],
    }).compile();

    controller = module.get<MonitoriaController>(MonitoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
