import {TotemService} from "../../src/services/TotemService";
import {Totem} from "../../src/entities/Totem";
import {Tranca} from "../../src/entities/Tranca";
import {Bicicleta} from "../../src/entities/Bicicleta";
import {TotemRepository} from "../../src/repositories/TotemRepository";
import {NovoTotemDTO} from "../../src/entities/dto/NovoTotemDTO";
import {Constantes} from "../../src/entities/constants/Constantes";
import {TrancaRepository} from "../../src/repositories/TrancaRepository";
import {BicicletaRepository} from "../../src/repositories/BicicletaRepository";
import {StatusTranca} from "../../src/entities/enums/StatusTranca";
import {StatusBicicleta} from "../../src/entities/enums/StatusBicicleta";
import { Error } from '../../src/entities/Error';


jest.mock('../../src/repositories/TotemRepository');
jest.mock('../../src/repositories/TrancaRepository');
jest.mock('../../src/repositories/BicicletaRepository');

const totemService = new TotemService();
const novoTotemMock = new Totem(1, '123456', '123456');

describe('TotemService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve listar todos os totens com sucesso', async () => {
        TotemRepository.getAll = jest.fn().mockReturnValue([novoTotemMock]);

        const result = await totemService.listarTotens();

        expect(result).toEqual([novoTotemMock]);
        expect(TotemRepository.getAll).toHaveBeenCalled();
    });

    it('deve retornar erro ao listar totens', async () => {
        TotemRepository.getAll = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.listarTotens();
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.ERRO_LISTAR_TOTENS);
        }
    });

    it('deve cadastrar um totem com sucesso', async () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste,');
        TotemRepository.create = jest.fn().mockReturnValue(novoTotemMock);

        const result = await totemService.cadastrarTotem(novoTotemDTO);

        expect(result).toEqual(novoTotemMock);
        expect(TotemRepository.create).toHaveBeenCalledWith(novoTotemDTO);
    });

    it('deve retornar erro ao cadastrar totem', async () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste,');
        TotemRepository.create = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.cadastrarTotem(novoTotemDTO);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_CRIAR_TOTEM);
        }
    });

    it('deve retornar totem por id com sucesso', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(novoTotemMock);

        const result = await totemService.getById(1);

        expect(result).toEqual(novoTotemMock);
        expect(TotemRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao buscar totem por id não existente', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.getById(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TOTEM_NAO_ENCONTRADO);
        }
    });

    it('deve editar totem com sucesso', async () => {
        const novoTotemDTO = new NovoTotemDTO('Localização Teste', 'Descrição Teste,');
        TotemRepository.update = jest.fn().mockReturnValue(novoTotemMock);
        TotemRepository.getById = jest.fn().mockReturnValue(novoTotemMock);

        const result = await totemService.editarTotem(1, novoTotemMock);

        expect(result).toEqual(novoTotemMock);
        expect(TotemRepository.update).toHaveBeenCalledWith(1, novoTotemMock);
    });

    it('deve retornar erro ao editar totem não existente', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.editarTotem(1, novoTotemMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TOTEM_NAO_ENCONTRADO);
        }
    });

    it('deve retornar erro ao editar totem', async () => {
        TotemRepository.update = jest.fn().mockReturnValue(undefined);
        TotemRepository.getById = jest.fn().mockReturnValue(novoTotemMock);

        try {
            await totemService.editarTotem(1, novoTotemMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.DADOS_INVALIDOS);
        }
    });

    it('deve remover totem com sucesso', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(novoTotemMock);
        TotemRepository.delete = jest.fn().mockReturnValue(true);

        await totemService.removerTotem(1);

        expect(TotemRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao remover totem não existente', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.removerTotem(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TOTEM_NAO_ENCONTRADO);
        }
    });

    it('deve retornar erro ao remover totem', async () => {
        TotemRepository.getById = jest.fn().mockReturnValue(novoTotemMock);
        TotemRepository.delete = jest.fn().mockReturnValue(false);

        try {
            await totemService.removerTotem(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_REMOVER_TOTEM);
        }
    });

    it('deve listar trancas por id do totem com sucesso', async () => {
        const trancasMock = [new Tranca(1, 123456, 'Localização Teste', '2023', 'Modelo Teste', StatusTranca.NOVA)];
        TrancaRepository.findByTotemId = jest.fn().mockReturnValue(trancasMock);

        const result = await totemService.listarTrancas(1);

        expect(result).toEqual(trancasMock);
        expect(TrancaRepository.findByTotemId).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao listar trancas por id do totem', async () => {
        TrancaRepository.findByTotemId = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.listarTrancas(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve listar bicicletas por id do totem com sucesso', async () => {
        const bicicletasMock = [new Bicicleta(1, 'Marca Teste', 'Modelo Teste', '2023', 123456, StatusBicicleta.NOVA)];
        BicicletaRepository.findByTotemId = jest.fn().mockReturnValue(bicicletasMock);

        const result = await totemService.listarBicicletas(1);

        expect(result).toEqual(bicicletasMock);
        expect(BicicletaRepository.findByTotemId).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao listar bicicletas por id do totem', async () => {
        BicicletaRepository.findByTotemId = jest.fn().mockReturnValue(undefined);

        try {
            await totemService.listarBicicletas(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

});
