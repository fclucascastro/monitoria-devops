import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('MonitoriaController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Teste para verificar se é possível criar uma monitoria
  it('should create a monitoria (POST /monitoria)', async () => {
    const createMonitoriaDto = {
      titulo: 'Monitoria de Redes',
      professor: 'Lucas Castro',
      horario: '14:00',
      local: 'Sala 204',
    };

    const response = await request(app.getHttpServer())
      .post('/monitoria')
      .send(createMonitoriaDto)
      .expect(201);  // Espera-se que a resposta tenha o status 201 (Created)

    // Verifique se a resposta contém os dados enviados
    expect(response.body).toHaveProperty('titulo', createMonitoriaDto.titulo);
    expect(response.body).toHaveProperty('professor', createMonitoriaDto.professor);
    expect(response.body).toHaveProperty('horario', createMonitoriaDto.horario);
    expect(response.body).toHaveProperty('local', createMonitoriaDto.local);
  });

  // Teste para listar todas as monitorias
  it('should get all monitorias (GET /monitoria)', async () => {
    const response = await request(app.getHttpServer())
      .get('/monitoria')
      .expect(200);  // Espera-se que a resposta tenha o status 200 (OK)

    // Verifique se a resposta é um array e contém monitorias
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);  // Verifique se há pelo menos uma monitoria
  });

  afterAll(async () => {
    await app.close();
  });
});
