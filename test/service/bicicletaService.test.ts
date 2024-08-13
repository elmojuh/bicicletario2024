import { BicicletaService } from '../../src/services/BicicletaService';
import { BicicletaRepository } from '../../src/repositories/BicicletaRepository';
import { TrancaRepository } from '../../src/repositories/TrancaRepository';
import { FuncionarioService } from '../../src/services/FuncionarioService';
import { EmailService } from '../../src/services/EmailService';
import { NovaBicicletaDTO } from '../../src/entities/dto/NovaBicicletaDTO';
import { IntegrarBicicletaNaRedeDTO } from '../../src/entities/dto/IntegrarBicicletaNaRedeDTO';
import { RetirarBicicletaDaRedeDTO } from '../../src/entities/dto/RetirarBicicletaDaRedeDTO';
import { StatusBicicleta } from '../../src/entities/enums/StatusBicicleta';
import { StatusTranca } from '../../src/entities/enums/StatusTranca';
import { Error } from '../../src/entities/Error';
import { Constantes } from '../../src/entities/constants/Constantes';
import { Bicicleta } from "../../src/entities/Bicicleta";

// Mocks
jest.mock('../../src/repositories/BicicletaRepository');
jest.mock('../../src/repositories/TrancaRepository');
jest.mock('../../src/services/FuncionarioService');
jest.mock('../../src/services/EmailService');

const bicicletaService = new BicicletaService();
const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);

describe('BicicletaService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar uma nova bicicleta', async () => {
        const dto = new NovaBicicletaDTO('Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        BicicletaRepository.create = jest.fn().mockReturnValue(bicicletaMock);

        const res = await bicicletaService.criarBicicleta(dto);

        expect(res).toEqual(bicicletaMock);
        expect(BicicletaRepository.create).toHaveBeenCalledWith(dto);
    });

    it('deve obter uma bicicleta pelo ID', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);

        const result = await bicicletaService.getById(1);

        expect(result).toEqual(bicicletaMock);
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao obter bicicleta não existente', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.getById(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve listar todas as bicicletas', async () => {
        BicicletaRepository.getAll = jest.fn().mockReturnValue([bicicletaMock]);

        const result = await bicicletaService.listarBicicletas();

        expect(result).toEqual([bicicletaMock]);
        expect(BicicletaRepository.getAll).toHaveBeenCalled();
    });

    it('deve retornar erro ao listar bicicletas não existentes', async () => {
        BicicletaRepository.getAll = jest.fn().mockReturnValue([]);

        try {
            await bicicletaService.listarBicicletas();
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.ERRO_LISTAR_BICICLETAS);
        }
    });

    it('deve editar uma bicicleta existente', async () => {
        const dto = new NovaBicicletaDTO('Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        BicicletaRepository.update = jest.fn().mockReturnValue(bicicletaMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);

        const result = await bicicletaService.editarBicicleta(1, dto);

        expect(result).toEqual(bicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve retornar erro ao editar bicicleta não existente', async () => {
        const dto = new NovaBicicletaDTO('Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.editarBicicleta(1, dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve remover uma bicicleta', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);
        BicicletaRepository.delete = jest.fn().mockReturnValue(true);

        await bicicletaService.removerBicicleta(1);

        expect(BicicletaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao remover bicicleta não existente', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.removerBicicleta(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve alterar o status da bicicleta', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(bicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.DISPONIVEL);

        expect(result).toEqual(bicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.DISPONIVEL }));
    });

    it('deve retornar erro ao alterar status de bicicleta não existente', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.alterarStatus(1, StatusBicicleta.DISPONIVEL);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

});
