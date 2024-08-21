import { BicicletaRepository } from "../../src/repositories/BicicletaRepository";
import { Bicicleta } from "../../src/entities/Bicicleta";
import { StatusBicicleta } from "../../src/entities/enums/StatusBicicleta";
import { NovaBicicletaDTO } from "../../src/entities/dto/NovaBicicletaDTO";
import {Tranca} from "../../src/entities/Tranca";
import {StatusTranca} from "../../src/entities/enums/StatusTranca";
import {Totem} from "../../src/entities/Totem";

describe('BicicletaRepository', () => {
    beforeEach(() => {
        // Limpa os dados de bicicletas antes de cada teste
        (BicicletaRepository as any).bicicletas = [];
        (BicicletaRepository as any).nextId = 1;
    });

    it('deve criar uma bicicleta com sucesso', () => {
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicleta = BicicletaRepository.create(novaBicicletaDTO);

        expect(bicicleta).toBeInstanceOf(Bicicleta);
        expect(bicicleta.id).toBe(1);
        expect(bicicleta.marca).toBe('Marca Teste');
    });

    it('deve retornar todas as bicicletas', () => {
        const novaBicicletaDTO1 = new NovaBicicletaDTO('Marca1', 'Modelo1', '2021', 1111, StatusBicicleta.NOVA);
        const novaBicicletaDTO2 = new NovaBicicletaDTO('Marca2', 'Modelo2', '2022', 2222, StatusBicicleta.DISPONIVEL);
        BicicletaRepository.create(novaBicicletaDTO1);
        BicicletaRepository.create(novaBicicletaDTO2);

        const bicicletas = BicicletaRepository.getAll();

        expect(bicicletas.length).toBe(2);
        expect(bicicletas[0].marca).toBe('Marca1');
        expect(bicicletas[1].marca).toBe('Marca2');
    });

    it('deve retornar uma bicicleta pelo ID', () => {
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicletaCriada = BicicletaRepository.create(novaBicicletaDTO);

        const bicicleta = BicicletaRepository.getById(bicicletaCriada.id);

        expect(bicicleta).not.toBeNull();
        expect(bicicleta?.id).toBe(bicicletaCriada.id);
    });

    it('deve retornar null ao buscar por ID inexistente', () => {
        const bicicleta = BicicletaRepository.getById(999);

        expect(bicicleta).toBeNull();
    });

    it('deve atualizar uma bicicleta existente', () => {
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicletaCriada = BicicletaRepository.create(novaBicicletaDTO);

        const dadosAtualizados = { marca: 'Marca Atualizada' };
        const bicicletaAtualizada = BicicletaRepository.update(bicicletaCriada.id, dadosAtualizados);

        expect(bicicletaAtualizada).not.toBeNull();
        expect(bicicletaAtualizada?.marca).toBe('Marca Atualizada');
    });

    it('deve retornar null ao tentar atualizar uma bicicleta inexistente', () => {
        const dadosAtualizados = { marca: 'Marca Inexistente' };
        const bicicletaAtualizada = BicicletaRepository.update(999, dadosAtualizados);

        expect(bicicletaAtualizada).toBeNull();
    });

    it('deve deletar uma bicicleta com sucesso', () => {
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicletaCriada = BicicletaRepository.create(novaBicicletaDTO);

        const resultadoDeletar = BicicletaRepository.delete(bicicletaCriada.id);

        expect(resultadoDeletar).toBe(true);
        expect(BicicletaRepository.getById(bicicletaCriada.id)).toBeNull();
    });

    it('deve retornar false ao tentar deletar uma bicicleta inexistente', () => {
        const resultadoDeletar = BicicletaRepository.delete(999);

        expect(resultadoDeletar).toBe(false);
    });

    it('deve retornar bicicletas associadas a uma tranca pelo trancaId', () => {
        const trancaMock = new Tranca(1, 123456, 'Localização Teste', '2023', 'Modelo Teste', StatusTranca.NOVA);
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicletaCriada = BicicletaRepository.create(novaBicicletaDTO);
        bicicletaCriada.tranca = trancaMock;

        const bicicletasEncontradas = BicicletaRepository.findByTrancaId(1);

        expect(bicicletasEncontradas.length).toBe(1);
        expect(bicicletasEncontradas[0].tranca?.id).toBe(1);
    });

    it('deve retornar bicicletas associadas a um totem pelo totemId', () => {
        const totemMock = new Totem(1, 'Localização Teste', 'Descrição Teste');
        const trancaMock = new Tranca(1, 123456, 'Localização Teste', '2023', 'Modelo Teste', StatusTranca.NOVA);
        const novaBicicletaDTO = new NovaBicicletaDTO('Marca Teste', 'Modelo Teste', '2023', 12345, StatusBicicleta.NOVA);
        const bicicletaCriada = BicicletaRepository.create(novaBicicletaDTO);
        bicicletaCriada.tranca = trancaMock;
        bicicletaCriada.tranca.totem =  totemMock;

        const bicicletasEncontradas = BicicletaRepository.findByTotemId(1);

        expect(bicicletasEncontradas.length).toBe(1);
        expect(bicicletasEncontradas[0].tranca?.totem?.id).toBe(1);
    });

    it('deve retornar uma lista vazia quando não houver bicicletas associadas a uma tranca', () => {
        const bicicletasEncontradas = BicicletaRepository.findByTrancaId(999);

        expect(bicicletasEncontradas.length).toBe(0);
    });

    it('deve retornar uma lista vazia quando não houver bicicletas associadas a um totem', () => {
        const bicicletasEncontradas = BicicletaRepository.findByTotemId(999);

        expect(bicicletasEncontradas.length).toBe(0);
    });
});
