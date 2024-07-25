// test/integration/bicicletaController.test.ts
import request from 'supertest';
import app from '../../src/server';
import { BicicletaService } from '../../src/services/BicicletaService';
import { IntegrarBicicletaNaRedeDTO } from '../../src/entities/dto/IntegrarBicicletaNaRedeDTO';
import { NovaBicicletaDTO } from '../../src/entities/dto/NovaBicicletaDTO';
import { RetirarBicicletaDaRedeDTO } from '../../src/entities/dto/RetirarBicicletaDaRedeDTO';
import { StatusBicicleta } from '../../src/entities/enums/StatusBicicleta';
import { Bicicleta } from '../../src/entities/Bicicleta';

jest.mock('../../src/services/BicicletaService');

const mockedBicicletaService = new BicicletaService() as jest.Mocked<BicicletaService>;
let bicicletaId: string;

describe('Rotas de Bicicleta em Controller', () => {
    it('deve criar uma nova bicicleta', async () => {
        const dto = new NovaBicicletaDTO(
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );
        const bicicleta = new Bicicleta(
            1,
            dto.marca,
            dto.modelo,
            dto.ano,
            dto.numero,
            dto.status
        )
        mockedBicicletaService.criarBicicleta.mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });
});
