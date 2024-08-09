import request from 'supertest';
import app from '../../src/server';
import {BicicletaService} from '../../src/services/BicicletaService';
import {NovaBicicletaDTO} from '../../src/entities/dto/NovaBicicletaDTO';
import {StatusBicicleta} from '../../src/entities/enums/StatusBicicleta';
import {StatusTranca} from "../../src/entities/enums/StatusTranca";
import {Bicicleta} from '../../src/entities/Bicicleta';
import {Constantes} from "../../src/entities/constants/Constantes";
import {IntegrarTrancaNaRedeDTO} from "../../src/entities/dto/IntegrarTrancaNaRedeDTO";
import {IntegrarBicicletaNaRedeDTO} from "../../src/entities/dto/IntegrarBicicletaNaRedeDTO";
import {Tranca} from "../../src/entities/Tranca";
import {FuncionarioService} from "../../src/services/FuncionarioService";
import {TrancaService} from "../../src/services/TrancaService";
import {TotemService} from "../../src/services/TotemService";
import {EmailService} from "../../src/services/EmailService";
import {RetirarBicicletaDaRedeDTO} from "../../src/entities/dto/RetirarBicicletaDaRedeDTO";

jest.mock('../../src/services/BicicletaService');
jest.mock('../../src/services/FuncionarioService');
jest.mock('../../src/services/EmailService');
jest.mock('../../src/services/TrancaService');
jest.mock('../../src/services/TotemService');

let bicicletaServiceMock = BicicletaService as jest.Mocked<typeof BicicletaService>;
let totemServiceMock = TotemService as jest.Mocked<typeof TotemService>;
let trancaServiceMock = TrancaService as jest.Mocked<typeof TrancaService>;
let funcionarioServiceMock = FuncionarioService as jest.Mocked<typeof FuncionarioService>;
let emailServiceMock = EmailService as jest.Mocked<typeof EmailService>;

funcionarioServiceMock.isFuncionarioValido = jest.fn().mockResolvedValue(true);

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
        );

        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });
    it('deve retornar erro ao criar bicicleta', async () => {
        const dto = new NovaBicicletaDTO(
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_CRIAR_BICICLETA));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retornar erro ao criar bicicleta com dados invalidos', async () => {
        const dto = new NovaBicicletaDTO(
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );
        bicicletaServiceMock.prototype.criarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.DADOS_INVALIDOS));

        const res = await request(app)
            .post('/api/bicicleta')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve obter uma bicicleta por ID', async () => {
        const bicicleta = new Bicicleta(
            1,
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );
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

    it('deve retornar erro ao obter bicicleta por ID com ID invalido', async () => {
        bicicletaServiceMock.prototype.getById = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_OBTER_BICICLETA));

        const res = await request(app)
            .get('/api/bicicleta/abc');
        expect(res.statusCode).toBe(404);
    });

    it('deve listar todas as bicicletas', async () => {
        const bicicletas = [
            new Bicicleta(
                1,
                'Marca de Teste',
                'Modelo de Teste',
                '2023',
                12344,
                StatusBicicleta.DISPONIVEL
            ),
            new Bicicleta(
                2,
                'Marca de Teste 2',
                'Modelo de Teste 2',
                '2023',
                12345,
                StatusBicicleta.DISPONIVEL
            )
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
        expect(res.statusCode).toBe(404);
    });

    it('deve editar uma bicicleta', async () => {
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
        );

        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockResolvedValue(bicicleta);

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(bicicleta.toResponseJSON());
    });

    it('deve retornar erro ao editar bicicleta', async () => {
        const dto = new NovaBicicletaDTO(
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );

        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_EDITAR_BICICLETA));

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retornar erro ao editar bicicleta por Id não encontrado', async () => {
        const dto = new NovaBicicletaDTO(
            'Marca de Teste',
            'Modelo de Teste',
            '2023',
            12344,
            StatusBicicleta.DISPONIVEL
        );

        bicicletaServiceMock.prototype.editarBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .put('/api/bicicleta/1')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve remover uma bicicleta', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockResolvedValue(bicicletaId);

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

    it('deve retornar erro ao remover bicicleta por ID não encontrado', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .delete('/api/bicicleta/1');
        expect(res.statusCode).toBe(404 || 422);
    });

    it('deve retornar erro ao remover bicicleta por ID invalido', async () => {
        bicicletaServiceMock.prototype.removerBicicleta = jest.fn().mockRejectedValue(new Error(Constantes.ERRO_REMOVER_BICICLETA));

        const res = await request(app)
            .delete('/api/bicicleta/abc');
        expect(res.statusCode).toBe(404);
    });

    it('deve integrar bicicleta na rede', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        const bicicleta = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12344, StatusBicicleta.NOVA);
        new Tranca(1, 12344, 'localizacao', '1998', 'modelo', StatusTranca.LIVRE,);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.alterarStatus = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockResolvedValue(bicicleta);
        funcionarioServiceMock.isFuncionarioValido = jest.fn().mockResolvedValue(true);

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

    it ('deve retornar erro ao integrar bicicleta na rede', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockRejectedValue(new Error(Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .post('/api/bicicleta/integrarNaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });

    it('deve retirar bicicleta da rede', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        const bicicleta = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12344, StatusBicicleta.NOVA);
        new Tranca(1, 12344, 'localizacao', '1998', 'modelo', StatusTranca.LIVRE,);

        bicicletaServiceMock.prototype.getById = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.alterarStatus = jest.fn().mockResolvedValue(bicicleta);
        bicicletaServiceMock.prototype.integrarNaRede = jest.fn().mockResolvedValue(bicicleta);
        funcionarioServiceMock.isFuncionarioValido = jest.fn().mockResolvedValue(true);

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

    it('deve retornar erro ao retirar bicicleta da rede', async () => {
        const dto = new RetirarBicicletaDaRedeDTO(1, 1, 1, 'EM_REPARO');
        bicicletaServiceMock.prototype.retirarDaRede = jest.fn().mockRejectedValue(new Error(Constantes.BICICLETA_NAO_ENCONTRADA));

        const res = await request(app)
            .post('/api/bicicleta/retirarDaRede')
            .send(dto);
        expect(res.statusCode).toBe(422);
    });
});
