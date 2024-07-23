// test/totem/totem.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/server';

let mongoServer: MongoMemoryServer;
let totemId: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Rotas de Totem', () => {
    it('deve criar um novo Totem', async () => {
        const res = await request(app)
            .post('/api/totem')
            .send({
                localizacao: 'Localização de Teste',
                descricao: 'Descricao de Teste'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('localizacao', 'Localização de Teste');
        totemId = res.body.id;
    });

    // it('deve buscar um Totem por id', async () => {
    //     const res = await request(app)
    //         .get(`/api/totem/${totemId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('id', totemId);
    // });

    it('deve listar todos os Totens', async () => {
        const res = await request(app)
            .get('/api/totem');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
