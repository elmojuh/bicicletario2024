import { TrancaRepository } from "../../src/repositories/TrancaRepository";
import { Tranca } from "../../src/entities/Tranca";
import { NovaTrancaDTO } from "../../src/entities/dto/NovaTrancaDTO";
import {StatusTranca} from "../../src/entities/enums/StatusTranca";
import {Totem} from "../../src/entities/Totem";

describe('TrancaRepository', () => {
    beforeEach(() => {
        // Limpa as trancas antes de cada teste
        (TrancaRepository as any).trancas = [];
        (TrancaRepository as any).nextId = 1;
    });

    it('deve criar uma tranca com sucesso', () => {
        const novaTrancaDTO = new NovaTrancaDTO(123456, 'Localização Teste', '2023', 'Modelo Teste', 'NOVA');
        const tranca = TrancaRepository.create(novaTrancaDTO);

        expect(tranca).toBeInstanceOf(Tranca);
        expect(tranca.id).toBe(1);
        expect(tranca.numero).toBe(123456);
        expect(tranca.localizacao).toBe('Localização Teste');
    });

    it('deve retornar todas as trancas', () => {
        const novaTrancaDTO1 = new NovaTrancaDTO(123456, 'Localização1', '2023', 'Modelo1', 'NOVA');
        const novaTrancaDTO2 = new NovaTrancaDTO(789101, 'Localização2', '2023', 'Modelo2', 'NOVA');
        TrancaRepository.create(novaTrancaDTO1);
        TrancaRepository.create(novaTrancaDTO2);

        const trancas = TrancaRepository.getAll();

        expect(trancas.length).toBe(2);
        expect(trancas[0].localizacao).toBe('Localização1');
        expect(trancas[1].localizacao).toBe('Localização2');
    });

    it('deve retornar uma tranca pelo ID', () => {
        const novaTrancaDTO = new NovaTrancaDTO(123456, 'Localização Teste', '2023', 'Modelo Teste', 'NOVA');
        const trancaCriada = TrancaRepository.create(novaTrancaDTO);

        const tranca = TrancaRepository.getById(trancaCriada.id);

        expect(tranca).not.toBeNull();
        expect(tranca?.id).toBe(trancaCriada.id);
    });

    it('deve retornar null ao buscar por ID inexistente', () => {
        const tranca = TrancaRepository.getById(999);

        expect(tranca).toBeNull();
    });

    it('deve atualizar uma tranca existente', () => {
        const novaTrancaDTO = new NovaTrancaDTO(123456, 'Localização Teste', '2023', 'Modelo Teste', 'NOVA');
        const trancaCriada = TrancaRepository.create(novaTrancaDTO);

        const dadosAtualizados = { localizacao: 'Localização Atualizada' };
        const trancaAtualizada = TrancaRepository.update(trancaCriada.id, dadosAtualizados);

        expect(trancaAtualizada).not.toBeNull();
        expect(trancaAtualizada?.localizacao).toBe('Localização Atualizada');
    });

    it('deve retornar null ao tentar atualizar uma tranca inexistente', () => {
        const dadosAtualizados = { localizacao: 'Localização Inexistente' };
        const trancaAtualizada = TrancaRepository.update(999, dadosAtualizados);

        expect(trancaAtualizada).toBeNull();
    });

    it('deve deletar uma tranca com sucesso', () => {
        const novaTrancaDTO = new NovaTrancaDTO(123456, 'Localização Teste', '2023', 'Modelo Teste', 'NOVA');
        const trancaCriada = TrancaRepository.create(novaTrancaDTO);

        TrancaRepository.delete(trancaCriada.id);

        expect(TrancaRepository.getById(trancaCriada.id)).toBeNull();
    });

    it('deve lançar um erro ao tentar deletar uma tranca inexistente', () => {
        expect(() => {
            TrancaRepository.delete(999);
        }).toThrowError('Tranca with id 999 not found');
    });

    it('deve listar trancas por ID do totem', () => {
        const novaTrancaDTO1 = new NovaTrancaDTO(123456, 'Localização1', '2023', 'Modelo1', StatusTranca.NOVA);
        const novaTrancaDTO2 = new NovaTrancaDTO(789101, 'Localização2', '2023', 'Modelo2', StatusTranca.NOVA);
        const tranca1 = TrancaRepository.create(novaTrancaDTO1);
        const tranca2 = TrancaRepository.create(novaTrancaDTO2);

        tranca1.totem = new Totem(1, 'Totem Localização 1', 'Totem Descrição 1');
        tranca2.totem = new Totem(2, 'Totem Localização 2', 'Totem Descrição 2');

        const trancasTotem1 = TrancaRepository.findByTotemId(1);
        const trancasTotem2 = TrancaRepository.findByTotemId(2);

        expect(trancasTotem1.length).toBe(1);
        expect(trancasTotem1[0].totem?.id).toBe(1);

        expect(trancasTotem2.length).toBe(1);
        expect(trancasTotem2[0].totem?.id).toBe(2);
    });
});
