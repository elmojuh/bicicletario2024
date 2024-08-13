import request from 'supertest';
import app from '../../src/server';
import {NovaTrancaDTO} from "../../src/entities/dto/NovaTrancaDTO";
import {TrancaService} from "../../src/services/TrancaService";
import {Tranca} from "../../src/entities/Tranca";
import {StatusTranca} from "../../src/entities/enums/StatusTranca";
import {Constantes} from "../../src/entities/constants/Constantes";
import { Error } from "../../src/entities/Error";
import {IntegrarTrancaNaRedeDTO} from "../../src/entities/dto/IntegrarTrancaNaRedeDTO";

jest.mock('../../src/services/TrancaService');

const trancaServiceMock = TrancaService as jest.Mocked<typeof TrancaService>;

const novaTrancaDTO = (numero: number = 12345, localizacao: string = 'Localização de Teste', anoDeFabricacao: string = '2023', modelo: string = 'Modelo de Teste', status: string = 'NOVA') =>
    new NovaTrancaDTO(numero, localizacao, anoDeFabricacao, modelo, status);

const tranca1 = (id: number = 1) =>
    new Tranca(id, 12345, 'Localização de Teste', '2023', 'Modelo de Teste', StatusTranca.NOVA);

const idTranca = 1;
const idBicicleta = 101;

describe('Tranca em Controller', () => {
    it('deve criar uma nova tranca', async () => {
        const dto = novaTrancaDTO();
        const tranca = tranca1(1);

        trancaServiceMock.prototype.cadastrarTranca = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .post('/api/tranca')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(tranca.toResponseJSON());
    });

    it('deve retornar erro ao criar uma nova tranca com dados inválidos', async () => {
        const dto = novaTrancaDTO(12345, 'Localização de Teste', '2023', 'Modelo de Teste', 'NOVA');
        trancaServiceMock.prototype.cadastrarTranca = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_CRIAR_TRANCA));

        const res = await request(app)
            .post('/api/tranca')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao criar tranca' });
    });

    it('deve listar todas as Trancas', async () => {
        const trancas = [
            tranca1(1),
            tranca1(2),
        ];
        trancaServiceMock.prototype.listarTrancas = jest.fn().mockResolvedValue(trancas);

        const res = await request(app)
            .get('/api/tranca');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(trancas.map(tranca => tranca.toResponseJSON()));
    });

    it('deve retornar erro ao listar todas as Trancas', async () => {
        trancaServiceMock.prototype.listarTrancas = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_LISTAR_TRANCAS));

        const res = await request(app)
            .get('/api/tranca');
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao listar trancas' });
    });

    it('deve obter uma tranca por ID', async () => {
        const tranca = tranca1(1);
        trancaServiceMock.prototype.getById = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .get('/api/tranca/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(tranca.toResponseJSON());
    });

    it('deve retornar erro ao obter tranca por ID', async () => {
        trancaServiceMock.prototype.getById = jest.fn().mockRejectedValue(new Error('404', Constantes.TRANCA_NAO_ENCONTRADA));

        const res = await request(app)
            .get('/api/tranca/1');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Tranca não encontrada' });
    });

    it('deve integrar uma tranca na rede', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        const tranca = tranca1(1);

        trancaServiceMock.prototype.integrarNaRede = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .post('/api/tranca/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao integrar uma tranca na rede', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        trancaServiceMock.prototype.integrarNaRede = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_INTEGRAR_TRANCA));

        const res = await request(app)
            .post('/api/tranca/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao integrar tranca na rede' });
    });

    it('deve retirar uma tranca da rede', async () => {
        const dto = novaTrancaDTO();
        trancaServiceMock.prototype.retirarDaRede = jest.fn().mockResolvedValue(dto);

        const res = await request(app)
            .post('/api/tranca/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao retirar uma tranca da rede', async () => {
        const dto = novaTrancaDTO();
        trancaServiceMock.prototype.retirarDaRede = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_RETIRAR_TRANCA));

        const res = await request(app)
            .post('/api/tranca/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao retirar tranca da rede' });
    });

    it('deve editar uma tranca existente', async () => {
        const dto = novaTrancaDTO();
        const tranca = tranca1(1);
        tranca.atualizar(dto);

        trancaServiceMock.prototype.editarTranca = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .put('/api/tranca/1')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(tranca.toResponseJSON());
    });

    it('deve retornar erro ao editar uma tranca', async () => {
        const dto = novaTrancaDTO(12345, 'Localização de Teste', '2023', 'Modelo de Teste', 'NOVA');
        trancaServiceMock.prototype.editarTranca = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_EDITAR_TRANCA));

        const res = await request(app)
            .put('/api/tranca/1')
            .send(dto);
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao editar tranca' });
    });

    it('deve remover uma tranca', async () => {
        trancaServiceMock.prototype.removerTranca = jest.fn().mockResolvedValue('1');

        const res = await request(app)
            .delete('/api/tranca/1');
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao remover uma tranca', async () => {
        trancaServiceMock.prototype.removerTranca = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_REMOVER_TRANCA));

        const res = await request(app)
            .delete('/api/tranca/1');
        expect(res.statusCode).toBe(422);
    });

    it('deve trancar uma tranca com sucesso', async () => {
        trancaServiceMock.prototype.trancarTranca = jest.fn().mockResolvedValue(Constantes.ACAO_BEM_SUCEDIDA);

        const res = await request(app)
            .post(`/api/tranca/${idTranca}/trancar`)
            .send({ bicicleta: idBicicleta });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual('Ação bem sucedida');
    });

    it('deve retornar erro ao trancar uma tranca já trancada', async () => {

        trancaServiceMock.prototype.trancarTranca = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_TRANCAR_TRANCA));

        const res = await request(app)
            .post(`/api/tranca/${idTranca}/trancar`)
            .send({ bicicleta: idBicicleta });

        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao trancar tranca' });
    });

    it('deve destrancar uma tranca com sucesso', async () =>{
        trancaServiceMock.prototype.destrancarTranca = jest.fn().mockResolvedValue(Constantes.ACAO_BEM_SUCEDIDA);

        const res = await request(app)
            .post(`/api/tranca/${idTranca}/destrancar`)
            .send({ bicicleta: idBicicleta });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual('Ação bem sucedida');
    });

    it('deve retornar erro ao destrancar uma tranca já destrancada', async () => {
        trancaServiceMock.prototype.destrancarTranca = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_DESTRANCAR_TRANCA));

        const res = await request(app)
            .post(`/api/tranca/${idTranca}/destrancar`)
            .send({ bicicleta: idBicicleta });

        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao destrancar tranca' });
    });

    it('deve alterar status da tranca para TRANCAR', async () => {
        const tranca = tranca1(1);
        trancaServiceMock.prototype.alterarStatus = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .post('/api/tranca/1/status/TRANCAR')
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(tranca.toResponseJSON());
    })

    it('deve alterar status da tranca para DESTRANCAR', async () => {
        const tranca = tranca1(1);
        trancaServiceMock.prototype.alterarStatus = jest.fn().mockResolvedValue(tranca);

        const res = await request(app)
            .post('/api/tranca/1/status/DESTRANCAR')
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(tranca.toResponseJSON());
    })

});
