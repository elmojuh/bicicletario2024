// test/tranca/trancaController.test.ts
import request from 'supertest';
import app from '../../src/server';

let trancaId: string;

describe('Rotas de Tranca', () => {
    it('deve criar uma nova Tranca', async () => {
        const res = await request(app)
            .post('/api/tranca')
            .send({
                numero: 12345,
                localizacao: 'Localização de Teste',
                anoDeFabricacao: '2023',
                modelo: 'Modelo de Teste',
                status: 'NOVA'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('numero', 12345);
        trancaId = res.body.id;
    });

    // it('deve buscar uma Tranca por id', async () => {
    //     // Substitua 'algumIdValido' pelo ID retornado no teste de criação
    //     const res = await request(app)
    //         .get(`/api/tranca/${trancaId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('id', trancaId);
    // });

    it('deve listar todas as Trancas', async () => {
        const res = await request(app)
            .get('/api/tranca');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
