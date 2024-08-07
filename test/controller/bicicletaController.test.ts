import request from 'supertest';
import app from '../../src/server';
import { BicicletaService } from '../../src/services/BicicletaService';
import { NovaBicicletaDTO } from '../../src/entities/dto/NovaBicicletaDTO';
import { StatusBicicleta } from '../../src/entities/enums/StatusBicicleta';
import { Bicicleta } from '../../src/entities/Bicicleta';
import { Constantes } from "../../src/entities/constants/Constantes";
import { IntegrarBicicletaNaRedeDTO } from "../../src/entities/dto/IntegrarBicicletaNaRedeDTO";
import { FuncionarioService } from "../../src/services/FuncionarioService";
import { RetirarBicicletaDaRedeDTO } from "../../src/entities/dto/RetirarBicicletaDaRedeDTO";

jest.mock('../../src/services/BicicletaService');
jest.mock('../../src/services/FuncionarioService');
jest.mock('../../src/services/EmailService');
jest.mock('../../src/services/TrancaService');
jest.mock('../../src/services/TotemService');

const bicicletaServiceMock = BicicletaService as jest.Mocked<typeof BicicletaService>;
const funcionarioServiceMock = FuncionarioService as jest.Mocked<typeof FuncionarioService>;

beforeEach(() => {
    funcionarioServiceMock.isFuncionarioValido = jest.fn().mockResolvedValue(true);
});

const criarBicicletaDTO = (marca: string = 'Marca de Teste', modelo: string = 'Modelo de Teste') =>
    new NovaBicicletaDTO(marca, modelo, '2023', 12344, StatusBicicleta.DISPONIVEL);

const criarBicicleta = (id: number = 1) =>
    new Bicicleta(id, 'Marca de Teste', 'Modelo de Teste', '2023', 12344, StatusBicicleta.DISPONIVEL);

describe('Rotas de Bicicleta em Controller', () => {
    it('deve criar uma nova bicicleta', async () => {
        const dto = criarBicicletaDTO();
        const bicicleta = criarBicicleta(1);

        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao criar bicicleta', async () => {
        const dto = criarBicicletaDTO();
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_CRIAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retornar erro ao criar bicicleta com dados inválidos', async () => {
        const dto = criarBicicletaDTO('Marca de Teste', '');
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.DADOS_INVALIDOS));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve obter uma bicicleta por ID', async () => {
        const bicicleta = criarBicicleta(1);
        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .get('/api/bicicleta/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao obter bicicleta por ID', async () => {
        bicicletaServiceMock.prototype.getById = jest.fn().mockRejectedValue(new Error(Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .get('/api/bicicleta/1');
        expect(res.statusCode).toBe(404);
    });

    it('deve listar todas as bicicletas', async () => {
        const bicicletas = [
            criarBicicleta(1),
            criarBicicleta(2)
        ];
        bicicletaServiceMock.prototype.listarBicicletas = jest.fn().mockResolvedValue(bicicletas);

        const res = await request(app)
            .get('/api/bicicleta');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicletas.map(bicicleta => bicicleta.toResponseJSON()));
    });

    it('deve retornar erro ao listar bicicletas', async () => {
        bicicletaServiceMock.prototype.listarBicicletas = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_LISTAR_BICICLETAS));

        const res = await request(app)
            .get('/api/bicicleta');
        expect(res.statusCode).toBe(500);
    });

    it('deve editar uma bicicleta existente', async () => {
        const dto = criarBicicletaDTO();
        const bicicleta = criarBicicleta(1);

        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao editar bicicleta', async () => {
        const dto = criarBicicletaDTO();
        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_EDITAR_BICICLETA));

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(404);
    });

    it('deve remover uma bicicleta', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockResolvedValue('1');

        const res = await request(app)
            .delete('/api/bicicleta/1');
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao remover bicicleta', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_REMOVER_BICICLETA));

        const res = await request(app)
            .delete('/api/bicicleta/1');
        expect(res.statusCode).toBe(404);
    });

    it('deve integrar bicicleta na rede', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        const bicicleta = criarBicicleta(1);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao integrar bicicleta na rede com dados inválidos', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_INTEGRAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retirar bicicleta da rede', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        const bicicleta = criarBicicleta(1);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao retirar bicicleta da rede com dados inválidos', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_RETIRAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });
});
