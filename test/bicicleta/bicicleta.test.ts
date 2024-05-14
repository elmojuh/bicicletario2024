// test/Bicicleta.bicicleta.test.ts
import request from 'supertest';
import app from '../../src/server';
import mongoose from 'mongoose';

let bicicletaId: string;

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/mydb');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Rotas de Bicicleta', () => {
    it('deve criar uma nova Bicicleta', async () => {
        const res = await request(app)
            .post('/api/bicicleta')
            .send({
                marca: 'Marca de Teste',
                modelo: 'Modelo de Teste',
                ano: '2023',
                numero: 12345,
                status: 'DISPONÍVEL'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('marca', 'Marca de Teste');
        bicicletaId = res.body._id; // Salve o ID para uso nos testes subsequentes
    });

    it('deve buscar todas as Bicicletas', async () => {
        const res = await request(app)
            .get('/api/bicicleta');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('deve buscar uma Bicicleta por id', async () => {
        const res = await request(app)
            .get(`/api/bicicleta/${bicicletaId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', bicicletaId);
    });

    it('deve atualizar uma Bicicleta', async () => {
        const res = await request(app)
            .put(`/api/bicicleta/${bicicletaId}`)
            .send({
                marca: 'Marca Atualizada',
                modelo: 'Modelo Atualizado',
                ano: '2024',
                numero: 54321,
                status: 'EM_USO'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('marca', 'Marca Atualizada');
    });

    it('deve deletar uma Bicicleta', async () => {
        const res = await request(app)
            .delete(`/api/bicicleta/${bicicletaId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', bicicletaId);
    });
});
