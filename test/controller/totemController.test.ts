import request from 'supertest';
import app from '../../src/server';
import { NovoTotemDTO} from "../../src/entities/dto/NovoTotemDTO";
import { Totem } from "../../src/entities/Totem";
import { TotemService } from "../../src/services/TotemService";
import { Constantes } from "../../src/entities/constants/Constantes";
import { Error } from "../../src/entities/Error";

jest.mock('../../src/services/TotemService'); // Mockar o serviço

const totemServiceMock = TotemService as jest.Mocked<typeof TotemService>;

const novoTotemDTO = (localizacao: string = 'Localização de Teste', descricao: string = 'Descricao de Teste') =>
    new NovoTotemDTO(localizacao, descricao);

const novoTotem = (id: number = 1) =>
    new Totem(id, 'Localização de Teste', 'Descricao de Teste');

describe('Totem em Controller', () => {
    it('deve criar um novo Totem', async () => {
        const dto = novoTotemDTO();
        const totem = novoTotem(1);

        totemServiceMock.prototype.cadastrarTotem = jest.fn().mockResolvedValue(totem);

        const res = await request(app)
            .post('/api/totem')
            .send(dto)
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(totem.toResponseJSON());
    });

    it('deve retornar erro ao criar um novo Totem com dados inválidos', async () => {
        const dto = novoTotemDTO('Localização de Teste', '');
        totemServiceMock.prototype.cadastrarTotem = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_CRIAR_TOTEM));

        const res = await request(app)
            .post('/api/totem')
            .send(dto)
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao criar totem' });
    });

    it('deve listar todos os Totens', async () => {
        const totens = [
            novoTotem(1),
            novoTotem(2),
        ];
        totemServiceMock.prototype.listarTotens = jest.fn().mockResolvedValue(totens);

        const res = await request(app)
            .get('/api/totem')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(totens.map(totem => totem.toResponseJSON()));
    });

    it('deve retornar erro ao listar todos os Totens', async () => {
        totemServiceMock.prototype.listarTotens = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_LISTAR_TOTENS));

        const res = await request(app)
            .get('/api/totem')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(422);
    });

    it('deve editar um Totem existente', async () => {
        const dto = novoTotemDTO('Nova Localização', 'Nova Descrição');
        const totem = novoTotem(1);
        totem.atualizar(dto);

        totemServiceMock.prototype.editarTotem = jest.fn().mockResolvedValue(totem);

        const res = await request(app)
            .put('/api/totem/1')
            .send(dto)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(totem.toResponseJSON());
    });

    it('deve retornar erro ao editar um Totem com dados inválidos', async () => {
        const dto = novoTotemDTO('Nova Localização', '');

        totemServiceMock.prototype.editarTotem = jest.fn().mockRejectedValue(new Error('422', Constantes.DADOS_INVALIDOS));

        const res = await request(app)
            .put('/api/totem/1')
            .send(dto)
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Dados inválidos' });
    });

    it('deve retornar erro ao editar um Totem que não existe', async () => {
        totemServiceMock.prototype.editarTotem = jest.fn().mockRejectedValue(new Error('404', Constantes.TOTEM_NAO_ENCONTRADO));

        const dto = novoTotemDTO();
        const res = await request(app)
            .put('/api/totem/1')
            .send(dto)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Totem não encontrado' });
    });

    it('deve remover um Totem existente', async () => {
        totemServiceMock.prototype.removerTotem = jest.fn().mockResolvedValue('1');

        const res = await request(app)
            .delete('/api/totem/1')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.statusCode).toBe(200);
    });

    it('deve retornar erro ao remover um Totem que não existe', async () => {
        totemServiceMock.prototype.removerTotem = jest.fn().mockRejectedValue(new Error('404', Constantes.TOTEM_NAO_ENCONTRADO));

        const res = await request(app)
            .delete('/api/totem/1')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Totem não encontrado' });
    });

    it('deve listar trancas presentes em um totem', async () => {
        const trancas = [
            { id: 1, localizacao: 'Localização 1', descricao: 'Descrição 1' },
            { id: 2, localizacao: 'Localização 2', descricao: 'Descrição 2' },
        ];
        totemServiceMock.prototype.listarTrancas = jest.fn().mockResolvedValue(trancas);

        const res = await request(app)
            .get('/api/totem/1/trancas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(trancas);
    })

    it('deve retornar erro ao não listar nenhuma tranca presente em um totem', async () => {
        totemServiceMock.prototype.listarTrancas = jest.fn().mockRejectedValue(new Error('404', Constantes.TRANCA_NAO_ENCONTRADA));

        const res = await request(app)
            .get('/api/totem/1/trancas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Tranca não encontrada' });
    });

    it('deve retornar erro ao listar trancas presentes em um totem', async () => {
        totemServiceMock.prototype.listarTrancas = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_LISTAR_TRANCAS));

        const res = await request(app)
            .get('/api/totem/1/trancas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao listar trancas' });
    });

    it('deve listar bicicletas presentes em um totem', async () => {
        const bicicletas = [
            { id: 1, modelo: 'Modelo 1', marca: 'Marca 1' },
            { id: 2, modelo: 'Modelo 2', marca: 'Marca 2' },
        ];
        totemServiceMock.prototype.listarBicicletas = jest.fn().mockResolvedValue(bicicletas);

        const res = await request(app)
            .get('/api/totem/1/bicicletas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicletas);
    })

    it('deve retornar erro ao não listar nenhuma bicicletas presentes em um totem', async () => {
        totemServiceMock.prototype.listarBicicletas = jest.fn().mockRejectedValue(new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .get('/api/totem/1/bicicletas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ codigo: '404', mensagem: 'Bicicleta não encontrada' });
    });

    it('deve retornar erro ao listar bicicletas presentes em um totem', async () => {
        totemServiceMock.prototype.listarBicicletas = jest.fn().mockRejectedValue(new Error('422', Constantes.ERRO_LISTAR_BICICLETAS));

        const res = await request(app)
            .get('/api/totem/1/bicicletas')
            .expect('Content-Type', /json/)
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({ codigo: '422', mensagem: 'Erro ao listar bicicletas' });
    });

});
