import { TotemRepository } from "../../src/repositories/TotemRepository";
import { Totem } from "../../src/entities/Totem";
import { NovoTotemDTO } from "../../src/entities/dto/NovoTotemDTO";

describe('TotemRepository', () => {
    beforeEach(() => {
        // Limpa os dados de totens antes de cada teste
        (TotemRepository as any).totens = [];
        (TotemRepository as any).nextId = 1;
    });

    it('deve criar um totem com sucesso', () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste');
        const totem = TotemRepository.create(novoTotemDTO);

        expect(totem).toBeInstanceOf(Totem);
        expect(totem.id).toBe(1);
        expect(totem.localizacao).toBe('Localização Teste');
    });

    it('deve retornar todos os totens', () => {
        const novoTotemDTO1 = new NovoTotemDTO('Localização1', 'Descrição1');
        const novoTotemDTO2 = new NovoTotemDTO('Localização2', 'Descrição2');
        TotemRepository.create(novoTotemDTO1);
        TotemRepository.create(novoTotemDTO2);

        const totens = TotemRepository.getAll();

        expect(totens.length).toBe(2);
        expect(totens[0].localizacao).toBe('Localização1');
        expect(totens[1].localizacao).toBe('Localização2');
    });

    it('deve retornar um totem pelo ID', () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste');
        const totemCriado = TotemRepository.create(novoTotemDTO);

        const totem = TotemRepository.getById(totemCriado.id);

        expect(totem).not.toBeNull();
        expect(totem?.id).toBe(totemCriado.id);
    });

    it('deve retornar null ao buscar por ID inexistente', () => {
        const totem = TotemRepository.getById(999);

        expect(totem).toBeNull();
    });

    it('deve atualizar um totem existente', () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste');
        const totemCriado = TotemRepository.create(novoTotemDTO);

        const dadosAtualizados = { localizacao: 'Localização Atualizada' };
        const totemAtualizado = TotemRepository.update(totemCriado.id, dadosAtualizados);

        expect(totemAtualizado).not.toBeNull();
        expect(totemAtualizado?.localizacao).toBe('Localização Atualizada');
    });

    it('deve retornar null ao tentar atualizar um totem inexistente', () => {
        const dadosAtualizados = { localizacao: 'Localização Inexistente' };
        const totemAtualizado = TotemRepository.update(999, dadosAtualizados);

        expect(totemAtualizado).toBeNull();
    });

    it('deve deletar um totem com sucesso', () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste');
        const totemCriado = TotemRepository.create(novoTotemDTO);

        const resultadoDeletar = TotemRepository.delete(totemCriado.id);

        expect(resultadoDeletar).toBe(true);
        expect(TotemRepository.getById(totemCriado.id)).toBeNull();
    });

    it('deve retornar false ao tentar deletar um totem inexistente', () => {
        const resultadoDeletar = TotemRepository.delete(999);

        expect(resultadoDeletar).toBe(false);
    });
});
