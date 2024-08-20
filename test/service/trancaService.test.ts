import {TrancaService} from '../../src/services/TrancaService';
import {TrancaRepository} from '../../src/repositories/TrancaRepository';
import {BicicletaRepository} from '../../src/repositories/BicicletaRepository';
import {TotemRepository} from '../../src/repositories/TotemRepository';
import {FuncionarioService} from '../../src/services/FuncionarioService';
import {NovaTrancaDTO} from '../../src/entities/dto/NovaTrancaDTO';
import {Tranca} from '../../src/entities/Tranca';
import {Bicicleta} from "../../src/entities/Bicicleta";
import {Constantes} from '../../src/entities/constants/Constantes';
import {StatusTranca} from '../../src/entities/enums/StatusTranca';
import {IntegrarTrancaNaRedeDTO} from '../../src/entities/dto/IntegrarTrancaNaRedeDTO';
import {RetirarTrancaDaRedeDTO} from '../../src/entities/dto/RetirarTrancaDaRedeDTO';
import {StatusAcaoReparador} from "../../src/entities/enums/StatusAcaoReparador";
import {StatusBicicleta} from "../../src/entities/enums/StatusBicicleta";
import {Error} from '../../src/entities/Error';
import {EmailService} from "../../src/services/EmailService";
import {Totem} from "../../src/entities/Totem";

jest.mock('../../src/repositories/TrancaRepository');
jest.mock('../../src/repositories/BicicletaRepository');
jest.mock('../../src/repositories/TotemRepository');
jest.mock('../../src/services/FuncionarioService');
jest.mock('../../src/services/EmailService');

const trancaService = new TrancaService();
const trancaLivreMock = new Tranca(1, 1, 'Local de Teste', '2023', 'Modelo Teste', StatusTranca.LIVRE);
const totemMockCompleta = new Totem(1, 'Localização de teste', 'Descricao de teste');
const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
const bicicletaMockNova = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
const bicicletaMockDisponivel = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.DISPONIVEL);
const integrarTrancaNaRedeDTO = new IntegrarTrancaNaRedeDTO(1, 1, 1);
const retirarTrancaDaRedeDTOEmReparo = new RetirarTrancaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);

const mockIntegracaoTranca = (statusTranca: StatusTranca, totemMock: any = { id: 1 }) => {
    trancaLivreMock.statusTranca = statusTranca;

    TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
    TotemRepository.getById = jest.fn().mockReturnValue(totemMock);
    FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(true);

    TrancaRepository.update = jest.fn().mockImplementation((id, updatedTranca) => {
        updatedTranca.statusTranca = StatusTranca.LIVRE; // Simulando a atualização correta
        return updatedTranca;
    });
};

const mockRetiradaTranca = (statusTranca: StatusTranca) => {
    trancaLivreMock.statusTranca = StatusTranca.LIVRE;

    TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
    TrancaRepository.update = jest.fn().mockImplementation((id, updatedTranca) => {
        updatedTranca.statusTranca = statusTranca;
        return updatedTranca;
    });
    EmailService.prototype.enviarEmailParaReparador = jest.fn();
};

describe('TrancaService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar uma nova tranca', async () => {
        const dto = new NovaTrancaDTO(1, 'Local Teste', 'Modelo Teste', '2023', StatusTranca.NOVA);
        TrancaRepository.create = jest.fn().mockReturnValue(trancaLivreMock);

        const result = await trancaService.cadastrarTranca(dto);

        expect(result).toEqual(trancaLivreMock);
        expect(TrancaRepository.create).toHaveBeenCalledWith(dto);
    });

    it('deve retornar erro ao cadastrar nova tranca', async () => {
        const dto = new NovaTrancaDTO(1, 'Local Teste', 'Modelo Teste', '2023', StatusTranca.NOVA);
        TrancaRepository.create = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.cadastrarTranca(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_CRIAR_TRANCA);
        }
    });

    it('deve listar todas as trancas', async () => {
        TrancaRepository.getAll = jest.fn().mockReturnValue([trancaLivreMock]);

        const result = await trancaService.listarTrancas();

        expect(result).toEqual([trancaLivreMock]);
        expect(TrancaRepository.getAll).toHaveBeenCalled();
    });

    it('deve retornar erro ao listar todas as trancas', async () => {
        TrancaRepository.getAll = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.listarTrancas();
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.ERRO_LISTAR_TRANCAS);
        }
    });

    it('deve obter uma tranca pelo ID', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        const result = await trancaService.getById(1);

        expect(result).toEqual(trancaLivreMock);
        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao tentar obter tranca que não existe', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.getById(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve editar uma tranca existente', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);

        const result = await trancaService.editarTranca(1, trancaLivreMock);

        expect(result).toEqual(trancaLivreMock);
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, trancaLivreMock);
    });

    it('deve retornar erro ao tentar editar tranca que não existe', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.editarTranca(1, trancaLivreMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao editar tranca', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TrancaRepository.update = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.editarTranca(1, trancaLivreMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_EDITAR_TRANCA);
        }
    });

    it('deve remover uma tranca existente', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TrancaRepository.delete = jest.fn().mockReturnValue(true);

        await trancaService.removerTranca(1);

        expect(TrancaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao tentar remover tranca que não existe', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.removerTranca(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve obter bicicleta na tranca com sucesso', async () => {
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        trancaLivreMock.bicicleta = bicicletaMockNova;
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        const result = await trancaService.obterBicicletaNaTranca(1);

        expect(result).toEqual(bicicletaMock);
        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao tentar obter bicicleta em uma tranca que não tem bicicleta', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.obterBicicletaNaTranca(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao obter tranca com bicicleta não existente', async () => {
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.obterBicicletaNaTranca(1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_OBTER_BICICLETA_TRANCA);
        }
    });

    it('deve integrar uma tranca na rede como NOVA', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        const totemMock = { id: 1 };

        mockIntegracaoTranca(StatusTranca.NOVA, totemMock);

        await trancaService.integrarNaRede(dto);

        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.LIVRE }));
        expect(FuncionarioService.isFuncionarioValido).toHaveBeenCalledWith(1);
        expect(TotemRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve integrar uma tranca na rede como EM_REPARO', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        const totemMock = { id: 1 };

        trancaLivreMock.statusTranca = StatusTranca.EM_REPARO; // Ou EM_REPARO

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.getById = jest.fn().mockReturnValue(totemMock);
        FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(true);

        TrancaRepository.update = jest.fn().mockImplementation((id, updatedTranca) => {
            updatedTranca.statusTranca = StatusTranca.EM_REPARO; // Simulando a atualização correta
            return updatedTranca;
        });

        await trancaService.integrarNaRede(dto);

        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.EM_REPARO }));
        expect(FuncionarioService.isFuncionarioValido).toHaveBeenCalledWith(1);
        expect(TotemRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao integrar tranca com status inválido', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
    });

    it('deve retornar erro ao integrar tranca com totem inválido', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TOTEM_NAO_ENCONTRADO);
        }
    });

    it('deve retornar erro ao integrar tranca com funcionário inválido', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.getById = jest.fn().mockReturnValue({ id: 1 });
        FuncionarioService.isFuncionarioValido = jest.fn().mockResolvedValue(false);

        try {
            await trancaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.FUNCIONARIO_INVALIDO);
        }
    });

    it('deve retornar erro ao integrar tranca com falha no envio de e-mail', async () => {
        const dto = new IntegrarTrancaNaRedeDTO(1, 1, 1);

        mockIntegracaoTranca(StatusTranca.NOVA);

        // Simulando erro no envio do e-mail
        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockRejectedValue(new Error('422', Constantes.ERROR_ENVIAR_EMAIL));

        try {
            await trancaService.integrarNaRede(dto);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERROR_ENVIAR_EMAIL);
        }
    });

    it('deve retirar a tranca da rede com sucesso EM_REPARO', async () => {
        const dtoMock = new RetirarTrancaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);

        mockRetiradaTranca(StatusTranca.EM_REPARO);

        await trancaService.retirarDaRede(dtoMock);

        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.EM_REPARO }));
        expect(EmailService.prototype.enviarEmailParaReparador).toHaveBeenCalledWith(1);
    });

    it('deve retirar a tranca da rede com sucesso APOSENTADA', async () => {
        const dtoMock = new RetirarTrancaDaRedeDTO(1, 1, 1, StatusAcaoReparador.APOSENTADA);

        mockRetiradaTranca(StatusTranca.APOSENTADA);

        await trancaService.retirarDaRede(dtoMock);

        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.APOSENTADA }));
        expect(EmailService.prototype.enviarEmailParaReparador).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao retirar tranca com status da tranca invalido', async () => {
        const dtoMock = new RetirarTrancaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);

        trancaLivreMock.totem = totemMockCompleta;
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.retirarDaRede(dtoMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
    });

    it('deve retornar erro ao tentar retirar tranca com status de statusAcaoReparador STATUS_DE_ACAO_REPARADOR_INVALIDO', async () => {
        const dtoMock = new RetirarTrancaDaRedeDTO(1, 1, 1, 'status_invalido' as StatusAcaoReparador);

        trancaLivreMock.totem = totemMockCompleta;
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.retirarDaRede(dtoMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DE_ACAO_REPARADOR_INVALIDO);
        }
    });

    it('deve retornar erro ao tentar retirar tranca com totem não encontrado', async () => {
        const dtoMock = new RetirarTrancaDaRedeDTO(1, 1, 1, StatusAcaoReparador.EM_REPARO);

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.retirarDaRede(dtoMock);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TOTEM_NAO_ENCONTRADO);
        }
    });

    it('deve retornar erro ao tentar retirar tranca com falha no envio de e-mail', async () => {
                trancaLivreMock.totem = totemMockCompleta;
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.getById = jest.fn().mockReturnValue(totemMockCompleta);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);
        TotemRepository.update = jest.fn().mockReturnValue(totemMockCompleta);

        // Simulando erro no envio do e-mail
        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockRejectedValue(new Error('422', Constantes.ERROR_ENVIAR_EMAIL));

        try {
            await trancaService.retirarDaRede(retirarTrancaDaRedeDTOEmReparo);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERROR_ENVIAR_EMAIL);
        }
    });

    it('deve trancar tranca com sucesso', async () => {
        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        trancaLivreMock.bicicleta = bicicletaMock;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);

        await trancaService.trancarTranca(1, 1);

        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
    });

    it('deve retornar erro ao trancar tranca com bicicleta não existente', async () => {
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        trancaLivreMock.bicicleta = bicicletaMockNova;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.trancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao trancar tranca com tranca inexistente', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.trancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao trancar tranca com status da tranca invalido', async () => {
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        trancaLivreMock.bicicleta = bicicletaMockNova;
        trancaLivreMock.bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMockNova);

        try {
            await trancaService.trancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
    });

    it('deve retornar erro ao trancar tranca com status da bicicleta invalido', async () => {
        const bicicletaMockAposentada = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.APOSENTADA);
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        trancaLivreMock.bicicleta = bicicletaMockAposentada;
        trancaLivreMock.bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMockAposentada);

        try {
            await trancaService.trancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao trancar tranca', async () => {
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        bicicletaMockNova.statusBicicleta = StatusBicicleta.NOVA;
        trancaLivreMock.bicicleta = bicicletaMockNova;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMockNova);
        TrancaRepository.update = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.trancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_TRANCAR_TRANCA);
        }
    });

    it('deve destrancar tranca com sucesso OCUPADA', async () => {
        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.DISPONIVEL);
        bicicletaMock.statusBicicleta = StatusBicicleta.DISPONIVEL;
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        trancaLivreMock.bicicleta = bicicletaMock;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);
        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockResolvedValue(true);  // Mock de sucesso

        await trancaService.destrancarTranca(1, 1);

        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.LIVRE }));
    });


    it('deve destrancar tranca com sucesso e enviar email ao destrancar tranca com status EM_REPARO', async () => {
        bicicletaMockDisponivel.statusBicicleta = StatusBicicleta.DISPONIVEL;
        trancaLivreMock.statusTranca = StatusTranca.EM_REPARO;
        trancaLivreMock.bicicleta = bicicletaMockDisponivel;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMockDisponivel);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);
        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockResolvedValue(true);  // Mock de sucesso

        await trancaService.destrancarTranca(1, 1);

        expect(TrancaRepository.getById).toHaveBeenCalledWith(1);
        expect(BicicletaRepository.getById).toHaveBeenCalledWith(1);
        expect(EmailService.prototype.enviarEmailParaReparador).toHaveBeenCalledWith(1);
        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.LIVRE }));
    });



    it('deve retornar erro de envio de email ao destrancar tranca', async () => {
        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.DISPONIVEL);
        bicicletaMock.statusBicicleta = StatusBicicleta.DISPONIVEL;
        trancaLivreMock.statusTranca = StatusTranca.EM_REPARO;
        trancaLivreMock.bicicleta = bicicletaMock;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);

        EmailService.prototype.enviarEmailParaReparador = jest.fn().mockRejectedValue(new Error('422', Constantes.ERROR_ENVIAR_EMAIL));

        try {
            await trancaService.destrancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERROR_ENVIAR_EMAIL);
        }
    });

    it('deve retornar erro ao destrancar tranca com bicicleta inexistente', async () => {
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.destrancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.BICICLETA_NAO_ENCONTRADA);
        }
    });

    it('deve retornar erro ao destrancar tranca com status da bicicleta invalido', async () => {
        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.NOVA);
        bicicletaMock.statusBicicleta = StatusBicicleta.APOSENTADA;
        trancaLivreMock.statusTranca = StatusTranca.OCUPADA;
        trancaLivreMock.bicicleta = bicicletaMock;
        trancaLivreMock.bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        BicicletaRepository.getById = jest.fn().mockReturnValue(bicicletaMock);

        try {
            await trancaService.destrancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
    });

    it('deve retornar erro ao destrancar tranca com status da tranca invalido', async () => {
        const bicicletaMock = new Bicicleta(1, 'Marca de Teste', 'Modelo de Teste', '2023', 12345, StatusBicicleta.DISPONIVEL);
        trancaLivreMock.statusTranca = 'invalido' as StatusTranca;
        trancaLivreMock.bicicleta = bicicletaMock;

        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.destrancarTranca(1, 1);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
    });

    it('deve retornar erro ao alterar status de tranca que não existe', async () => {
        TrancaRepository.getById = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.alterarStatus(1, 'TRANCAR');
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('404');
            expect(error.mensagem).toBe(Constantes.TRANCA_NAO_ENCONTRADA);
        }
    });

    it('deve alterar status para OCUPADA', async () => {
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TrancaRepository.update = jest.fn().mockReturnValue(trancaLivreMock);

        await trancaService.alterarStatus(1, StatusTranca.OCUPADA);

        expect(TrancaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ statusTranca: StatusTranca.OCUPADA }));
    });

    it('deve retornar erro ao alterar status da tranca com status invalido', async () => {
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);

        try {
            await trancaService.alterarStatus(1, 'STATUS_INVALIDO' as StatusTranca);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
    });

    it('deve retornar erro ao alterar status da tranca', async () => {
        trancaLivreMock.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.getById = jest.fn().mockReturnValue(trancaLivreMock);
        TrancaRepository.update = jest.fn().mockReturnValue(undefined);

        try {
            await trancaService.alterarStatus(1, StatusTranca.OCUPADA);
        } catch (error: Error | any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.codigo).toBe('422');
            expect(error.mensagem).toBe(Constantes.ERRO_ALTERAR_STATUS_TRANCA);
        }
    });

});
