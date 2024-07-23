// test/BicicletaDTO.bicicleta.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/server';

let mongoServer: MongoMemoryServer;
let bicicletaId: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Rotas de BicicletaDTO', () => {
    jest.mock('../../src/services/FuncionarioService', () => ({
        isFuncionarioValido: jest.fn().mockResolvedValue(true)
    }));
    jest.mock('../../src/services/EmailService', () => ({
        enviarEmailParaReparador: jest.fn().mockResolvedValue(true)
    }));
    jest.mock('../../src/repositories/BicicletaRepository', () => ({
        getById: jest.fn().mockImplementation(id => Promise.resolve({
            id,
            statusBicicleta: 'DISPONIVEL',
            // Adicione mais propriedades conforme necessário para o teste
        })),
        update: jest.fn().mockResolvedValue(true)
    }));
    jest.mock('../../src/services/TrancaService', () => ({
        getById: jest.fn().mockResolvedValue({
            statusTranca: 'LIVRE',
            // Adicione mais propriedades conforme necessário para o teste
        }),
        update: jest.fn().mockResolvedValue(true)
    }));
    jest.mock('../../src/services/TrancaService');
    it('deve criar uma nova BicicletaDTO', async () => {
        const res = await request(app)
            .post('/api/bicicleta')
            .send({
                marca: 'Marca de Teste',
                modelo: 'Modelo de Teste',
                ano: '2023',
                numero: 12345,
                status: 'DISPONIVEL'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('marca', 'Marca de Teste');
        bicicletaId = res.body.id;
    });

    it('deve buscar todas as Bicicletas', async () => {
        const res = await request(app)
            .get('/api/bicicleta');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('deve buscar uma BicicletaDTO por id', async () => {
        const res = await request(app)
            .get(`/api/bicicleta/${bicicletaId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', bicicletaId); // Certifique-se de que esta linha está correta e corresponde à propriedade esperada
    });

    // it('deve integrar uma bicicleta a rede', async () => {
    //     const res = await request(app)
    //         .post('/api/bicicleta/integrarNaRede')
    //         .send({
    //             idBicicleta: 'algumIdValido', // Garanta que este ID seja reconhecido pelos mocks
    //             idTranca: 'algumIdValido', // Garanta que este ID seja reconhecido pelos mocks
    //             idFuncionario: 1
    //         });
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('status', 'DISPONIVEL');
    // });
    // it('deve atualizar uma BicicletaDTO', async () => {
    //     const res = await request(app)
    //         .put(`/api/bicicleta/${bicicletaId}`)
    //         .send({
    //             marca: 'Marca Atualizada',
    //             modelo: 'Modelo Atualizado',
    //             ano: '2024',
    //             numero: 54321,
    //             status: 'EM_USO'
    //         });
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('marca', 'Marca Atualizada');
    // });
    //
    // it('deve deletar uma BicicletaDTO', async () => {
    //     const res = await request(app)
    //         .delete(`/api/bicicleta/${bicicletaId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('_id', bicicletaId);
    // });
});
