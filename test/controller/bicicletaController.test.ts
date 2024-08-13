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
import { Error } from "../../src/entities/Error";

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

const bicicleta1 = (id: number = 1) =>
    new Bicicleta(id, 'Marca de Teste', 'Modelo de Teste', '2023', 12344, StatusBicicleta.DISPONIVEL);

const bicicletaUnExist = new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);

describe('Bicicleta em Controller', () => {
    it('deve criar uma nova bicicleta', async () => {
        const dto = criarBicicletaDTO();
        const bicicleta = bicicleta1(1);

        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao criar bicicleta', async () => {
        const dto = criarBicicletaDTO();
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_CRIAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retornar erro ao criar bicicleta', async () => {
        const dto = criarBicicletaDTO('Marca de Teste', '');
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_CRIAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao criar bicicleta' });
    });

    it('deve obter uma bicicleta por ID', async () => {
        const bicicleta = bicicleta1(1);
        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .get('/api/bicicleta/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao obter bicicleta por ID', async () => {
        bicicletaServiceMock.prototype.getById = jest.fn().mockRejectedValue(new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .get('/api/bicicleta/1');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve listar todas as bicicletas', async () => {
        const bicicletas = [
            bicicleta1(1),
            bicicleta1(2)
        ];
        bicicletaServiceMock.prototype.listarBicicletas = jest.fn().mockResolvedValue(bicicletas);

        const res = await request(app)
            .get('/api/bicicleta')
            .expect('Content-Type', /json/);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicletas.map(bicicleta => bicicleta.toResponseJSON()));
    });

    it('deve retornar erro ao listar bicicletas', async () => {
        bicicletaServiceMock.prototype.listarBicicletas = jest.fn().mockRejectedValue(new Error('404', Constantes.ERRO_LISTAR_BICICLETAS));

        const res = await request(app)
            .get('/api/bicicleta');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Erro ao listar bicicletas' });
    });

    it('deve editar uma bicicleta existente', async () => {
        const dto = criarBicicletaDTO();
        const bicicleta = bicicleta1(1);

        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao editar bicicleta que não existe', async () => {
        const dto = criarBicicletaDTO();
        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockRejectedValue(new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve retornar erro ao editar bicicleta', async () => {
        const dto = criarBicicletaDTO();
        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_EDITAR_BICICLETA));

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao editar bicicleta' });
    });

    it('deve remover uma bicicleta', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockResolvedValue('1');

        const res = await request(app)
            .delete('/api/bicicleta/1');
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao remover bicicleta', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockRejectedValue(new Error('404', Constantes.ERRO_REMOVER_BICICLETA));

        const res = await request(app)
            .delete('/api/bicicleta/1');
        expect(res.statusCode).toBe(404);
    });

    it('deve integrar bicicleta na rede', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        const bicicleta = bicicleta1(1);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao integrar bicicleta não existente', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 999, 1);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockRejectedValue(new Error('422', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve retornar erro ao integrar bicicleta na rede com dados inválidos', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_INTEGRAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao integrar bicicleta na rede' });
    });

    it('deve retirar bicicleta da rede', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        const bicicleta = bicicleta1(1);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao retirar bicicleta não existente', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 999, 1, 'EM_REPARO');
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockRejectedValue(new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve retornar erro ao retirar bicicleta da rede com dados inválidos', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_RETIRAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao retirar bicicleta da rede' });
    });

    it('deve alterar o status da bicicleta para EM_REPARO', async () => {
        const bicicleta = bicicleta1(1);
        bicicletaServiceMock.prototype.alterarStatus = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta/1/status/EM_REPARO')
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(Constantes.ACAO_BEM_SUCEDIDA);
    });


    it('deve retornar erro ao tentar alterar status de uma bicicleta inexistente', async () => {
        bicicletaServiceMock.prototype.alterarStatus = jest.fn().mockRejectedValue(new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .post('/api/bicicleta/999/status/DISPONIVEL')
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve retornar erro ao tentar alterar para um status inválido', async () => {
        bicicletaServiceMock.prototype.alterarStatus = jest.fn().mockRejectedValue(new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO));

        const res = await request(app)
            .post('/api/bicicleta/1/status/INVALIDO')
            .send();

        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Status da bicicleta inválido' });
    });

});
