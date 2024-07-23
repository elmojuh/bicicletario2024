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
        bicicletaId = res.body._id;
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
        expect(res.body).toHaveProperty('_id', bicicletaId);
    });

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
