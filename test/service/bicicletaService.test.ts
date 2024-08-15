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
import { StatusAcaoReparador } from '../../src/entities/enums/StatusAcaoReparador';
import {Tranca} from "../../src/entities/Tranca";

jest.mock('../../src/repositories/BicicletaRepository');
jest.mock('../../src/repositories/TrancaRepository');
jest.mock('../../src/services/FuncionarioService');
jest.mock('../../src/services/EmailService');

const bicicletaService = new BicicletaService();
const novaBicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
const bicicletaDisponivelMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.DISPONIVEL);
const trancaMock = { id: 1, statusTranca: StatusTranca.LIVRE };
const trancaMockCompleta = new Tranca(1, 1, 'Localização de teste', '2022', 'Modelo Teste', StatusTranca.LIVRE);

describe('BicicletaService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar uma nova bicicleta', async () => {
        const dto = new NovaBicicletaDTO('Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        BicicletaRepository.create = jest.fn().mockReturnValue(novaBicicletaMock);

        const res = await bicicletaService.criarBicicleta(dto);

        expect(res).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.create).toHaveBeenCalledWith(dto);
    });

    it('deve obter uma bicicleta pelo ID', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.getById(1);

        expect(result).toEqual(novaBicicletaMock);
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
        BicicletaRepository.getAll = jest.fn().mockReturnValue([novaBicicletaMock]);

        const result = await bicicletaService.listarBicicletas();

        expect(result).toEqual([novaBicicletaMock]);
        expect(BicicletaRepository.getAll).toHaveBeenCalled();
    });

    it('deve retornar erro ao listar bicicletas', async () => {
        BicicletaRepository.getAll = jest.fn().mockReturnValue(undefined);

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
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.editarBicicleta(1, dto);

        expect(result).toEqual(novaBicicletaMock);
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

    it('deve retornar erro ao editar bicicleta', async () => {
        const dto = new NovaBicicletaDTO('Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        BicicletaRepository.update = jest.fn().mockReturnValue(undefined);
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);

        try {
            await bicicletaService.editarBicicleta(1, dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_EDITAR_BICICLETA);
        }
    });

    it('deve remover uma bicicleta', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
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

    it('deve retornar erro ao remover bicicleta', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.delete = jest.fn().mockReturnValue(false);

        try {
            await bicicletaService.removerBicicleta(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_REMOVER_BICICLETA);
        }
    });

    it('deve integrar bicicleta a rede', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);

        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaMock);
        FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(true);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaMock);

        await bicicletaService.integrarNaRede(dto);

        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(FuncionarioService.isFuncionarioValido).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.DISPONIVEL }));
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.OCUPADA }));
    });

    it('deve retornar erro ao integrar bicicleta a rede com status de bicicleta inválido', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);

        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.EM_USO);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao integrar bicicleta não existente', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);

        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao integrar bicicleta com status invalido', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);

        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        novaBicicletaMock.statusBicicleta = StatusBicicleta.EM_USO;

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao integrar bicicleta a rede com tranca não encontrada', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(null);

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao integrar bicicleta a rede com funcionário inválido', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue({ id: 1, statusTranca: StatusTranca.LIVRE });
        FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(false);

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.FUNCIONARIO_INVALIDO);
        }
    });

    it('deve retornar erro ao integrar bicicleta a rede com erro ao enviar email', async () => {
        const dto = new IntegrarBicicletaNaRedeDTO(1, 1, 1);

        const novaBicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);

        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaMock);
        FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(true);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaMock);

        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockRejectedValue(new Error('400', Constantes.ERROR_ENVIAR_EMAIL));

        try {
            await bicicletaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERROR_ENVIAR_EMAIL);
        }
    });

    it('deve retirar a bicicleta da rede com sucesso EM_REPARO', async () => {
        const dtoMock = new RetirarBicicletaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);

        bicicletaDisponivelMock.tranca = trancaMockCompleta;
        bicicletaDisponivelMock.statusBicicleta = StatusBicicleta.DISPONIVEL;

        // Mockando os repositórios
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaDisponivelMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaMockCompleta);
        BicicletaRepository.update = jest.fn().mockReturnValue(bicicletaDisponivelMock);
        TrancaRepository.update = jest.fn();
        EmailService.prototype.enviarEmailParaReparador = jest.fn();

        // Chama o método para retirar a bicicleta da rede
        await bicicletaService.retirarDaRede(dtoMock);

        // Verifica se os métodos foram chamados corretamente
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.EM_REPARO }));
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.LIVRE }));
        expect(EmailService.prototype.enviarEmailParaReparador).toHaveBeenCalledWith(1);
    });

    it('deve retirar a bicicleta da rede com sucesso APOSENTADA', async () => {
        const dtoMock = new RetirarBicicletaDaRedeDTO(1, 1, 1, StatusAcaoReparador.APOSENTADA);

        bicicletaDisponivelMock.tranca = trancaMockCompleta;
        bicicletaDisponivelMock.statusBicicleta = StatusBicicleta.DISPONIVEL;

        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaDisponivelMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaMockCompleta);
        BicicletaRepository.update = jest.fn().mockReturnValue(bicicletaDisponivelMock);
        TrancaRepository.update = jest.fn();
        EmailService.prototype.enviarEmailParaReparador = jest.fn();

        // Chama o método para retirar a bicicleta da rede
        await bicicletaService.retirarDaRede(dtoMock);

        // Verifica se os métodos foram chamados corretamente
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.EM_REPARO }));
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.LIVRE }));
        expect(EmailService.prototype.enviarEmailParaReparador).toHaveBeenCalledWith(1);
    });


    it('deve retornar erro ao retirar bicicleta que não está disponível', async () => {
        const dtoMock = new RetirarBicicletaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO as StatusAcaoReparador);
        novaBicicletaMock.statusBicicleta = StatusBicicleta.EM_USO;
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);

        try {
            await bicicletaService.retirarDaRede(dtoMock);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao retirar bicicleta com tranca não encontrada', async () => {
        const dtoMock = new RetirarBicicletaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO as StatusAcaoReparador);
        novaBicicletaMock.statusBicicleta = StatusBicicleta.DISPONIVEL;
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.retirarDaRede(dtoMock);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao enviar e-mail ao reparador', async () => {
        const dtoMock = new RetirarBicicletaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);
        novaBicicletaMock.statusBicicleta = StatusBicicleta.DISPONIVEL;
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaMock);
        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockRejectedValue(new Error('422', Constantes.ERROR_ENVIAR_EMAIL));

        try {
            await bicicletaService.retirarDaRede(dtoMock);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERROR_ENVIAR_EMAIL);
        }
    });

    it('deve alterar o status da bicicleta para DISPONIVEL', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.DISPONIVEL);

        expect(result).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.DISPONIVEL }));
    });

    it('deve alterar o status da bicicleta para EM_USO', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.EM_USO);

        expect(result).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.EM_USO }));
    });

    it('deve alterar o status da bicicleta para EM_REPARO', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.EM_REPARO);

        expect(result).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.EM_REPARO }));
    });

    it('deve alterar o status da bicicleta para NOVA', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.NOVA);

        expect(result).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.NOVA }));
    });

    it('deve alterar o status da bicicleta para APOSENTADA', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(novaBicicletaMock);

        const result = await bicicletaService.alterarStatus(1, StatusBicicleta.APOSENTADA);

        expect(result).toEqual(novaBicicletaMock);
        expect(BicicletaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusBicicleta: StatusBicicleta.APOSENTADA }));
    });

    it('deve retornar erro ao alterar status da bicicleta para status inválido', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);

        try {
            await bicicletaService.alterarStatus(1, 'status_invalido' as StatusBicicleta);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao alterar bicicleta', async () => {
        BicicletaRepository.getById = jest.fn().mockReturnValue(novaBicicletaMock);
        BicicletaRepository.update = jest.fn().mockReturnValue(undefined);

        try {
            await bicicletaService.alterarStatus(1, StatusBicicleta.DISPONIVEL);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_EDITAR_BICICLETA);
        }
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
